import { Event } from '@/types';

export const mockEvents: Event[] = [
  {
    id: '1',
    type: 'event',
    title: 'HackFest 2024',
    description: '24-hour hackathon with amazing prizes and networking opportunities',
    category: 'hackathon',
    date: '2024-03-15',
    time: '9:00 AM - 9:00 AM (Next Day)',
    location: 'Tech Hub Center',
    price: 0,
    posterUrl: '/images/events/genesis.jpg',
    highlights: [
      'Cash prizes worth $10,000',
      'Industry mentors',
      'Free food and drinks',
      'Swag kits'
    ],
    includes: [
      'Workspace',
      'High-speed internet',
      'Meals and refreshments',
      'Certificate'
    ]
  },
  {
    id: '2',
    type: 'event',
    title: 'DevConnect Conference',
    description: 'The largest developer conference in Asia with top industry speakers',
    category: 'conference',
    date: '2024-04-10',
    time: '9:00 AM - 6:00 PM',
    location: 'Convention Center',
    price: 199.99,
    posterUrl: '/images/events/tech-conf.jpg',
    highlights: [
      'International speakers',
      'Networking sessions',
      'Live coding workshops',
      'Career fair'
    ],
    includes: [
      'Conference pass',
      'Lunch and refreshments',
      'Conference swag',
      'Access to recordings'
    ]
  },
  {
    id: '3',
    type: 'event',
    title: 'AI Summit 2024',
    description: 'Explore the future of artificial intelligence and machine learning',
    category: 'tech',
    date: '2024-05-20',
    time: '10:00 AM - 5:00 PM',
    location: 'Innovation Center',
    price: 149.99,
    posterUrl: '/images/events/oxygen.jpg',
    highlights: [
      'AI demos',
      'Expert panels',
      'Research presentations',
      'Networking'
    ],
    includes: [
      'Summit access',
      'Workshop materials',
      'Lunch',
      'Digital resources'
    ]
  },
  {
    id: '4',
    type: 'event',
    title: 'FANPIT INDIA',
    description: 'The biggest tech education event in India',
    category: 'education',
    date: '2024-04-01',
    time: '9:00 AM - 6:00 PM',
    location: 'Convention Center',
    price: 99.99,
    posterUrl: '/images/events/fanpit-india.jpg',
    highlights: [
      'Industry experts',
      'Hands-on workshops',
      'Networking opportunities',
      'Career guidance'
    ],
    includes: [
      'Conference materials',
      'Lunch and refreshments',
      'Certificate',
      'Access to recordings'
    ]
  },
  {
    id: '5',
    type: 'event',
    title: 'StartUp Summit 2024',
    description: 'Connect with investors, mentors, and fellow entrepreneurs',
    category: 'business',
    date: '2024-03-20',
    time: '10:00 AM - 5:00 PM',
    location: 'Business Center',
    price: 149.99,
    posterUrl: '/images/events/startup.jpg',
    highlights: [
      'Pitch competitions',
      'Investor meetings',
      'Panel discussions',
      'Networking sessions'
    ],
    includes: [
      'Event access',
      'Pitch deck review',
      'Lunch and refreshments',
      'Networking dinner'
    ]
  }
];

export const mockExperiences: Event[] = [
  {
    id: '1',
    type: 'experience',
    title: 'Brew Your Own Coffee',
    description: 'Learn the art of coffee brewing from expert baristas',
    category: 'workshop',
    date: '2024-03-25',
    time: '10:00 AM - 1:00 PM',
    location: 'Artisan Coffee Lab',
    price: 79.99,
    posterUrl: '/images/experiences/coffee.jpg',
    highlights: [
      'Professional equipment',
      'Premium coffee beans',
      'Small group size',
      'Take-home kit'
    ],
    includes: [
      'Coffee brewing kit',
      'Coffee beans sample',
      'Recipe guide',
      'Certificate'
    ]
  },
  {
    id: '2',
    type: 'experience',
    title: 'Pottery Workshop',
    description: 'Create your own ceramic masterpiece',
    category: 'workshop',
    date: '2024-03-28',
    time: '2:00 PM - 5:00 PM',
    location: 'Creative Arts Studio',
    price: 89.99,
    posterUrl: '/images/experiences/pottery.jpg',
    highlights: [
      'Expert guidance',
      'All materials included',
      'Take home your creation',
      'Small group setting'
    ],
    includes: [
      'Clay and tools',
      'Glazing and firing',
      'Apron',
      'Refreshments'
    ]
  },
  {
    id: '3',
    type: 'experience',
    title: 'Culinary Adventure',
    description: 'Master the art of Indian cuisine',
    category: 'workshop',
    date: '2024-04-05',
    time: '6:00 PM - 9:00 PM',
    location: 'Spice Kitchen',
    price: 129.99,
    posterUrl: '/images/experiences/cooking.jpg',
    highlights: [
      'Professional chef instruction',
      'Hands-on cooking',
      'Wine pairing',
      'Recipe collection'
    ],
    includes: [
      'All ingredients',
      'Cooking equipment',
      'Apron',
      'Dinner and wine'
    ]
  }
];