export type EventType = 'event' | 'experience';

export type EventCategory =
  | 'conference'
  | 'hackathon'
  | 'meetup'
  | 'business'
  | 'education'
  | 'tech'
  | 'workshop'
  | 'culinary'
  | 'art'
  | 'wellness';

export interface Event {
  id: string;
  type: EventType;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  price: number;
  posterUrl: string;
  highlights: string[];
  includes: string[];
  bandId?: string;
}

export interface Band {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  genre: string;
  members: string[];
  socialLinks: {
    website?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
  gallery: string[];
}