export type EventCategory = 'music' | 'olahraga' | 'seni' | 'workshop';

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  music: 'Musik',
  olahraga: 'Olahraga',
  seni: 'Seni',
  workshop: 'Workshop',
};

export interface Event {
  id: string;
  organizer_id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string; // ISO8601
  location: string;
  image_url?: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  price: number;
  kind: 'GA' | 'SEATED';
  total_quota: number;
  price_status: 'OPEN' | 'LOCKED';
}
