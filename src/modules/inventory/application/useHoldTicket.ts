import { useMutation } from '@tanstack/react-query';
import { ticketApi } from '../infrastructure/ticketApi';
import type { HoldItem, HoldResponse } from '../domain/Ticket';

export interface HoldTicketInput {
  eventId: string;
  items: HoldItem[];
  queueToken?: string | null;
}

export function useHoldTicket() {
  return useMutation<HoldResponse, Error, HoldTicketInput>({
    mutationFn: ({ eventId, items, queueToken }: HoldTicketInput) =>
      ticketApi.holdTickets(eventId, items, queueToken).then((r) => r.data),
  });
}
