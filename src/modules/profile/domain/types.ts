import type { User } from '../../auth/domain/User';

export interface ProfileData extends User {}

export interface UsernameAvailability {
  available: boolean;
}

export interface TicketSummary {
  id: string;
  event_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}
