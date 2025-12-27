
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { EVENT_DATA as INITIAL_DATA } from './constants';
import { EventCard } from './components/EventCard';
import { ShowEvent, EventType } from './types';
import { Calendar, Filter, AlertCircle, Wifi, WifiOff, Loader2, RefreshCw, Plus } from 'lucide-react';
import { supabase } from './supabase';

const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    let totalMinutes = hours * 60 + minutes;

    // For NYE context: AM times (0-7) follow PM times
    if (period === 'AM' && hours < 8) {
        totalMinutes += 24 * 60;
    }

    return totalMinutes;
};

const sortEvents = (events: ShowEvent[]) => {
    return [...events].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
};

const App: React.FC = () => {
    const [events, setEvents] = useState<ShowEvent[]>([]);
    const [filter, setFilter] = useState<EventType>(EventType.ALL);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const firstEventRef = useRef<HTMLDivElement>(null);
    const noEventsRef = useRef<HTMLDivElement>(null);

    const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('events')
                .select('*');

            if (fetchError) throw fetchError;

            if (data && data.length > 0) {
                setEvents(sortEvents(data as ShowEvent[]));
            } else {
                const { error: seedError } = await supabase
                    .from('events')
                    .insert(INITIAL_DATA);
                
                if (seedError) throw seedError;
                setEvents(sortEvents(INITIAL_DATA));
            }
        } catch (err: any) {
            console.error('Error fetching events:', err);
            setError('Cloud sync failed. Showing local data.');
            setEvents(sortEvents(INITIAL_DATA));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();

        const channel = supabase
            .channel('public:events')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'events' },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        const updated = payload.new as ShowEvent;
                        setEvents(prev => sortEvents(prev.map(e => e.id === updated.id ? updated : e)));
                    } else if (payload.eventType === 'INSERT') {
                        const newItem = payload.new as ShowEvent;
                        setEvents(prev => sortEvents([...prev, newItem]));
                    } else if (payload.eventType === 'DELETE') {
                        const oldItem = payload.old as { id: string };
                        setEvents(prev => prev.filter(e => e.id !== oldItem.id));
                    }
                }
            )
            .subscribe((status) => {
                setIsOnline(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const filteredEvents = useMemo(() => {
        const base = filter === EventType.ALL ? events : events.filter(e => e.type === filter);
        return sortEvents(base);
    }, [filter, events]);

    const handleUpdateEvent = async (updatedEvent: ShowEvent) => {
        const originalEvents = [...events];
        
        // Handle insert for new items, update for existing
        const isNew = !events.find(e => e.id === updatedEvent.id);
        
        // Optimistic update
        if (isNew) {
            setEvents(prev => sortEvents([...prev, updatedEvent]));
        } else {
            setEvents(prev => sortEvents(prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)));
        }

        try {
            if (isNew) {
                const { error: insertError } = await supabase
                    .from('events')
                    .insert(updatedEvent);
                if (insertError) throw insertError;
            } else {
                const { error: updateError } = await supabase
                    .from('events')
                    .update(updatedEvent)
                    .eq('id', updatedEvent.id);
                if (updateError) throw updateError;
            }
        } catch (err: any) {
            console.error('Save failed:', err);
            setError('Cloud save failed. Reverting...');
            setEvents(originalEvents);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        const originalEvents = [...events];
        // Optimistic delete
        setEvents(prev => prev.filter(e => e.id !== id));

        try {
            const { error: deleteError } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
        } catch (err: any) {
            console.error('Delete failed:', err);
            setError('Failed to delete segment from cloud.');
            setEvents(originalEvents);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleAddSegment = () => {
        const newId = crypto.randomUUID();
        const newEvent: ShowEvent = {
            id: newId,
            startTime: '7:00 PM',
            endTime: '7:30 PM',
            title: 'New Segment',
            description: 'Enter description here...',
            artists: [],
            type: EventType.COMEDY,
            isHighlight: false
        };
        // We don't save to DB yet, just local state. 
        // EventCard will handle the initial save or auto-deletion if canceled.
        setEvents(prev => [newEvent, ...prev]);
        setFilter(EventType.ALL); // Switch to 'All' to ensure the new segment is visible
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (isLoading) return;
        const timer = setTimeout(() => {
            if (filteredEvents.length > 0 && firstEventRef.current) {
                firstEventRef.current.focus({ preventScroll: true });
            } else if (filteredEvents.length === 0 && noEventsRef.current) {
                noEventsRef.current.focus({ preventScroll: true });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [filter, filteredEvents.length, isLoading]);

    const categories = Object.values(EventType);

    return (
        <div className="min-h-screen bg-[#FDF0D5] text-[#003049] pb-20">
            <header className="sticky top-0 z-50 bg-[#003049] shadow-md">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white font-['Plein'] tracking-wide">
                                Khaas Re Live
                            </h1>
                            <div className="flex items-center gap-3">
                                <p className="text-xs text-[#FDF0D5]/80 flex items-center gap-1 font-['Switzer']">
                                    <Calendar className="w-3 h-3" /> 31st Dec • Show Flow
                                </p>
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter transition-colors ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                                    {isOnline ? 'Live Sync' : 'Connecting'}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleAddSegment}
                                className="bg-[#C1121F] text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-all active:scale-95 flex items-center gap-1 text-xs font-bold font-['Switzer']"
                                title="Add Segment"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                            <button 
                                onClick={fetchEvents}
                                className="p-2 text-[#FDF0D5]/40 hover:text-white transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 items-center" role="tablist">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                role="tab"
                                aria-selected={filter === cat}
                                onClick={() => setFilter(cat)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border outline-none font-['Switzer']
                                    ${filter === cat 
                                        ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-sm scale-105' 
                                        : 'bg-white/10 border-white/20 text-[#FDF0D5] hover:bg-white/20'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {error && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#C1121F] text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-bounce font-['Switzer'] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <main className="max-w-md mx-auto px-4 pt-6">
                <div className="relative">
                    {isLoading && events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#003049]/40">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#C1121F]" />
                            <p className="font-['Switzer'] text-sm font-medium">Syncing Cloud Database...</p>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <EventCard 
                                key={event.id} 
                                event={event}
                                ref={index === 0 ? firstEventRef : null}
                                onUpdate={handleUpdateEvent}
                                onDelete={handleDeleteEvent}
                            />
                        ))
                    ) : (
                        <div 
                            ref={noEventsRef}
                            tabIndex={-1}
                            className="text-center py-20 text-[#003049]/60 outline-none"
                        >
                            <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-['Switzer']">No Segments Found.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-4 bg-[#003049]/10 rounded-lg border border-[#003049]/20 flex gap-3 text-[#003049]">
                    <AlertCircle className="w-5 h-5 text-[#C1121F] flex-shrink-0" />
                    <p className="text-xs font-['Switzer'] leading-relaxed">
                        <strong>Cloud Sync:</strong> Use the "Add" button to insert new segments. Any edits or deletions are broadcast to all users immediately.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default App;
