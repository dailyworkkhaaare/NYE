import { ShowEvent, EventType } from './types';

export const EVENT_DATA: ShowEvent[] = [
    {
        id: '1',
        startTime: '7:00 PM',
        endTime: '7:15 PM',
        title: 'Audience Entry',
        subtitle: 'Comedy Poetry Show + Jugal Bandi',
        description: 'Introduction By Host + Small Crowd Work To Kick Off The Evening.',
        artists: ['Prasad Nakil'],
        type: EventType.COMEDY
    },
    {
        id: '2',
        startTime: '7:15 PM',
        endTime: '8:00 PM',
        title: 'Gadhya Padya Madhya',
        description: 'An Engaging Poetry Session Featuring A Mix Of Styles.',
        artists: ['Ketan Dhas', 'Prasad', 'Nikita', 'Bhakti'],
        type: EventType.POETRY
    },
    {
        id: '3',
        startTime: '8:00 PM',
        endTime: '8:30 PM',
        title: 'Ayushyavr Bolu Kahihi',
        subtitle: 'गारठा, दमलेला निब्बा, खाऊन पिऊन निवांत',
        description: 'Sitting Format Conversation.',
        artists: ['Sanja', 'Mandar', 'Sandy', 'Prasad', 'Atharva'],
        type: EventType.COMEDY
    },
    {
        id: '4',
        startTime: '8:30 PM',
        endTime: '8:40 PM',
        title: 'Mimicry Showcase',
        description: 'A Dedicated Mimicry Performance.',
        artists: ['Pooja Sadamate'],
        type: EventType.COMEDY
    },
    {
        id: '5',
        startTime: '8:40 PM',
        endTime: '9:15 PM',
        title: 'Folk-Fusion (Valla Fok)',
        subtitle: 'भाई मला प्यायला जायचंय, टॉक्सिक बॉयफ्रेंड, काम द्या, सुट्टी सुट्टी, पिल्लू म्हणायची',
        description: 'Jugalbandi + Folk-Fusion Musical Performance.',
        artists: ['Sanja', 'Folk Lok'],
        type: EventType.MUSIC
    },
    {
        id: '6',
        startTime: '9:15 PM',
        endTime: '9:30 PM',
        title: 'Stand-Up Comedy',
        description: 'Solo Stand-Up Act.',
        artists: ['Vishal Zalte'],
        type: EventType.COMEDY
    },
    {
        id: '7',
        startTime: '9:30 PM',
        endTime: '10:00 PM',
        title: 'Dank Brothers (Shal Jode)',
        description: 'Roasting Session.',
        artists: ['Sanja', 'Vishay Zalte'],
        type: EventType.COMEDY
    },
    {
        id: '8',
        startTime: '10:00 PM',
        endTime: '10:15 PM',
        title: 'Rap Section',
        subtitle: 'Var Bgh Var, Gavran Munde, Ranatali Por',
        description: 'Shabdik Maar - High Energy Rap Performance.',
        artists: ['Sanja', 'Niru', 'Vaibhav', 'Dancers'],
        type: EventType.MUSIC
    },
    {
        id: '9',
        startTime: '10:00 PM',
        endTime: '10:15 PM',
        title: 'Nach Baliye (Dance)',
        subtitle: 'Chulivar, Mirchu, Khamba',
        description: 'Dance And Party Section.',
        artists: ['Bhakti & Dance Group', 'Mandar'],
        type: EventType.DANCE
    },
    {
        id: '10',
        startTime: '10:30 PM',
        endTime: '12:00 AM',
        title: 'Khaas Re Gondhal',
        subtitle: 'The Grand Finale',
        description: 'DJ Setup And Open Floor.',
        artists: ['SANDSTRM'],
        type: EventType.DJ,
        isHighlight: true
    }
];