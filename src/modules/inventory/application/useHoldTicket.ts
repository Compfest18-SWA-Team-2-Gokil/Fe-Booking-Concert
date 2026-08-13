import { useMutation } from '@tanstack/react-query';
import { ticketApi } from '../infrastructure/ticketApi';
import type { HoldItem, HoldResponse } from '../domain/Ticket';

export function useHoldTicket() {
  return useMutation<HoldResponse, Error, HoldItem[]>({
    mutationFn: (items: HoldItem[]) =>
      ticketApi.holdTickets(items).then((r) => r.data),
  });
}
