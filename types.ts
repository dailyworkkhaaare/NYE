export enum EventType {
    ALL = 'All',
    COMEDY = 'Comedy',
    POETRY = 'Poetry',
    MUSIC = 'Music',
    DANCE = 'Dance',
    DJ = 'DJ Party'
}

export interface Artist {
    name: string;
    role?: string;
}

export interface ShowEvent {
    id: string;
    startTime: string; // Format HH:mm
    endTime: string;   // Format HH:mm
    title: string;
    subtitle?: string; // For Marathi text or secondary titles
    description: string;
    artists: string[]; // List of artist names
    type: EventType;
    isHighlight?: boolean; // For special segments like Midnight
}