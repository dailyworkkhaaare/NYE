
import { forwardRef, useState, useEffect } from 'react';
import { Clock, Users, Music, Mic, Zap, PartyPopper, Edit2, Check, X, Tag, Trash2, AlertTriangle } from 'lucide-react';
import { ShowEvent, EventType } from '../types';

interface EventCardProps {
    event: ShowEvent;
    onUpdate: (event: ShowEvent) => void;
    onDelete: (id: string) => void;
}

const getIconForType = (type: EventType) => {
    switch (type) {
        case EventType.MUSIC: return <Music className="w-4 h-4" />;
        case EventType.COMEDY: return <Mic className="w-4 h-4" />;
        case EventType.DANCE: return <Zap className="w-4 h-4" />;
        case EventType.DJ: return <PartyPopper className="w-4 h-4" />;
        default: return <Users className="w-4 h-4" />;
    }
};

const formatTime = (time: string) => {
    if (!time) return "TBD";
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(time)) return time.toUpperCase();
    if (/^\d{1,2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;
        return `${h12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return time.toUpperCase();
};

const getDuration = (start: string, end: string) => {
    const parseMinutes = (timeStr: string) => {
        if (!timeStr) return 0;
        const normalized = timeStr.toUpperCase().trim();
        let timePart = normalized;
        let periodPart = '';

        if (normalized.includes('PM')) {
            timePart = normalized.replace('PM', '').trim();
            periodPart = 'PM';
        } else if (normalized.includes('AM')) {
            timePart = normalized.replace('AM', '').trim();
            periodPart = 'AM';
        }

        const match = timePart.match(/(\d+):(\d+)/);
        if (!match) return 0;
        
        let hours = parseInt(match[1], 10);
        let minutes = parseInt(match[2], 10);
        
        if (periodPart === 'PM' && hours !== 12) hours += 12;
        if (periodPart === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
    };

    try {
        let diff = parseMinutes(end) - parseMinutes(start);
        if (diff < 0) diff += 1440; 
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h}h`;
        return `${m}m`;
    } catch (e) {
        return '';
    }
};

export const EventCard = forwardRef<HTMLDivElement, EventCardProps>(({ event, onUpdate, onDelete }, ref) => {
    const [isEditing, setIsEditing] = useState(event.title === 'New Segment');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const [title, setTitle] = useState(event.title);
    const [startTime, setStartTime] = useState(event.startTime);
    const [endTime, setEndTime] = useState(event.endTime);
    const [type, setType] = useState<EventType>(event.type);
    const [isHighlight, setIsHighlight] = useState(event.isHighlight || false);
    const [subtitle, setSubtitle] = useState(event.subtitle || '');
    const [description, setDescription] = useState(event.description);
    const [artistsRaw, setArtistsRaw] = useState(event.artists.join(', '));

    useEffect(() => {
        if (!isEditing) {
            setTitle(event.title);
            setStartTime(event.startTime);
            setEndTime(event.endTime);
            setType(event.type);
            setIsHighlight(event.isHighlight || false);
            setSubtitle(event.subtitle || '');
            setDescription(event.description);
            setArtistsRaw(event.artists.join(', '));
        }
    }, [event, isEditing]);

    const duration = getDuration(event.startTime, event.endTime);

    const handleSave = () => {
        const updatedArtists = artistsRaw
            .split(',')
            .map(s => s.trim())
            .filter(s => s !== '');

        const updatedEvent: ShowEvent = {
            ...event,
            title,
            startTime,
            endTime,
            type,
            isHighlight,
            subtitle,
            description,
            artists: updatedArtists
        };

        onUpdate(updatedEvent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (event.title === 'New Segment') {
            onDelete(event.id);
        } else {
            setTitle(event.title);
            setStartTime(event.startTime);
            setEndTime(event.endTime);
            setType(event.type);
            setIsHighlight(event.isHighlight || false);
            setSubtitle(event.subtitle || '');
            setDescription(event.description);
            setArtistsRaw(event.artists.join(', '));
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div ref={ref} className="relative mb-6 pl-8 transition-all duration-300 outline-none">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#C1121F]/40"></div>
                <div className="absolute left-[-5px] top-6 w-3 h-3 rounded-full border-2 bg-white border-[#C1121F]"></div>
                
                <div className="rounded-xl p-5 border-2 bg-white border-[#C1121F] shadow-lg animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <span className="font-bold text-[#C1121F] text-xs uppercase tracking-widest font-inter">
                            {event.title === 'New Segment' ? 'Create New Segment' : 'Editing Segment'}
                        </span>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => setShowDeleteConfirm(true)} 
                                className="p-1.5 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={handleCancel} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-[#003049]/60 uppercase mb-1 block font-inter">Start Time</label>
                                <input 
                                    type="text" 
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    className="w-full text-sm font-medium border-b border-gray-200 focus:border-[#C1121F] outline-none py-1 transition-colors font-inter"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    placeholder="7:00 PM"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[#003049]/60 uppercase mb-1 block font-inter">End Time</label>
                                <input 
                                    type="text" 
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    className="w-full text-sm font-medium border-b border-gray-200 focus:border-[#C1121F] outline-none py-1 transition-colors font-inter"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    placeholder="8:00 PM"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-[#003049]/60 uppercase mb-1 block font-inter">Title</label>
                            <input 
                                type="text" 
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="w-full text-lg font-bold border-b border-gray-200 focus:border-[#C1121F] outline-none py-1 transition-colors font-display"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Segment Name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-[#003049]/60 uppercase mb-1 block font-inter">Category</label>
                                <select 
                                    className="w-full text-sm border-b border-gray-200 focus:border-[#C1121F] outline-none py-1 bg-transparent font-inter"
                                    value={type}
                                    onChange={e => setType(e.target.value as EventType)}
                                >
                                    {Object.values(EventType).filter(t => t !== EventType.ALL).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isHighlight} 
                                        onChange={e => setIsHighlight(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#C1121F] focus:ring-[#C1121F]"
                                    />
                                    <span className="text-xs font-medium font-inter">Highlight</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-[#003049]/60 uppercase mb-1 block font-inter">Subtitle (Marathi Info)</label>
                            <input 
                                type="text" 
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="w-full text-sm border-b border-gray-200 focus:border-[#C1121F] outline-none py-1 text-[#C1121F] font-marathi"
                                value={subtitle}
                                onChange={e => setSubtitle(e.target.value)}
                                placeholder="Secondary text..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-[#003049]/60 uppercase mb-1 block font-inter">Description</label>
                            <textarea 
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="w-full text-sm border-b border-gray-200 focus:border-[#C1121F] outline-none py-1 resize-none bg-transparent font-marathi"
                                rows={2}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="What's happening?"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-[#003049]/60 uppercase mb-1 block font-inter">Performers (Comma separated)</label>
                            <input 
                                type="text" 
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                className="w-full text-sm border-b border-gray-200 focus:border-[#C1121F] outline-none py-1 font-inter"
                                value={artistsRaw}
                                onChange={e => setArtistsRaw(e.target.value)}
                                placeholder="Name 1, Name 2..."
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button 
                                onClick={handleSave}
                                className="flex-1 bg-[#003049] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#003049]/90 font-inter transition-all shadow-md active:scale-95"
                            >
                                <Check className="w-4 h-4" /> {event.title === 'New Segment' ? 'Add to Timeline' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {showDeleteConfirm && (
                    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h4 className="font-bold text-[#003049] mb-2 font-display">Delete this segment?</h4>
                        <p className="text-sm text-[#003049]/60 mb-6 font-inter">This will remove it from all users' schedules in real-time.</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium font-inter hover:bg-gray-50">Cancel</button>
                            <button onClick={() => onDelete(event.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold font-inter hover:bg-red-700 shadow-md">Yes, Delete</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div ref={ref} className="relative mb-6 pl-8 transition-all duration-300 opacity-100 group outline-none" tabIndex={-1}>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#003049]/20"></div>
            <div className="absolute left-[-5px] top-6 w-3 h-3 rounded-full border-2 bg-[#FDF0D5] border-[#C1121F] shadow-[0_0_10px_rgba(193,18,31,0.5)]"></div>

            <div className="relative rounded-xl p-5 border bg-white border-[#669BBC]/50 hover:border-[#C1121F] shadow-sm transition-all group-focus:ring-2 group-focus:ring-[#C1121F] group-focus:border-[#C1121F]">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setIsEditing(true)} className="p-2 rounded-full text-[#003049]/40 hover:text-[#C1121F] hover:bg-[#C1121F]/5 transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-full text-[#003049]/40 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="flex justify-between items-start mb-2 pr-20">
                    <div className="flex items-center flex-wrap gap-2 text-sm text-[#780000] font-bold">
                        <Clock className="w-3 h-3" />
                        <span className="tracking-wide font-inter">
                            {formatTime(event.startTime)} – {formatTime(event.endTime)}
                        </span>
                        {duration && <span className="text-[10px] font-medium text-[#003049]/50 bg-[#003049]/5 px-1.5 py-0.5 rounded font-inter ml-1">{duration}</span>}
                    </div>
                    <div className="px-2 py-1 rounded-md bg-[#003049]/10 text-[#003049] text-xs flex items-center gap-1 font-semibold font-inter">
                        {getIconForType(event.type)}
                        {event.type}
                    </div>
                </div>

                <h3 className={`text-xl font-bold text-[#003049] mb-1 leading-tight font-display tracking-tight ${event.isHighlight ? 'text-[#C1121F]' : ''}`}>
                    {event.title}
                    {event.isHighlight && <Tag className="inline ml-2 w-4 h-4" />}
                </h3>
                
                {event.subtitle && <p className="text-[#C1121F] font-medium text-sm mb-2 font-marathi">{event.subtitle}</p>}
                
                <p className="text-[#003049]/80 text-sm mb-4 leading-relaxed font-marathi">
                    {event.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#003049]/10">
                    <div className="w-full mb-1">
                        <div className="group/tooltip relative inline-flex items-center gap-2 text-xs text-[#003049]/60 font-inter cursor-help w-fit">
                            <Users className="w-3 h-3" />
                            <span className="underline decoration-dotted underline-offset-2">Performers:</span>
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block min-w-[180px] max-w-[240px] bg-[#003049] text-[#FDF0D5] text-xs rounded-lg shadow-xl z-20 p-3 pointer-events-none">
                                <p className="font-bold border-b border-[#FDF0D5]/20 pb-1 mb-1 font-display text-[#FDF0D5]">Full Lineup</p>
                                <p className="font-marathi leading-relaxed text-[#FDF0D5]/90">{event.artists.length > 0 ? event.artists.join(', ') : 'None'}</p>
                                <div className="absolute top-full left-5 -translate-x-1/2 border-4 border-transparent border-t-[#003049]"></div>
                            </div>
                        </div>
                    </div>
                    {event.artists.length > 0 ? event.artists.map((artist, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-[#FDF0D5] text-[#003049] text-xs font-medium border border-[#003049]/10 font-inter">{artist}</span>
                    )) : (
                        <span className="text-[10px] text-[#003049]/40 font-inter">No performers listed</span>
                    )}
                </div>

                {showDeleteConfirm && (
                    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h4 className="font-bold text-[#003049] mb-2 font-display">Delete segment?</h4>
                        <div className="flex gap-3 w-full max-w-[240px]">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium font-inter hover:bg-gray-50">Back</button>
                            <button onClick={() => onDelete(event.id)} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold font-inter hover:bg-red-700 shadow-sm">Delete</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

EventCard.displayName = 'EventCard';
