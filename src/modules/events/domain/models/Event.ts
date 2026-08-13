export interface Event {
  id: string;
  organizer_id: string;
  name: string;
  date: string; // ISO8601
  location: string;
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
