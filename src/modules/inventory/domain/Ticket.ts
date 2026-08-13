export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  price: number; // rupiah
  kind: 'GA' | 'SEATED';
  total_quota: number;
}

export interface HoldResponse {
  held_until: string; // ISO8601
  unit_ids: string[];
}

export interface HoldItem {
  ticket_type_id: string;
  quantity: number;
}
