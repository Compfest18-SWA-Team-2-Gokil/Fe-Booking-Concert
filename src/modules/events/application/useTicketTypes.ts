import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../infrastructure/eventsApi';
import type { TicketType } from '../../inventory/domain/Ticket';

export function useTicketTypes(eventId: string) {
  return useQuery<TicketType[]>({
    queryKey: ['ticket-types', eventId],
    queryFn: () =>
      eventsApi.getTicketTypes(eventId).then((r) => r.data.ticket_types),
    enabled: !!eventId,
  });
}
