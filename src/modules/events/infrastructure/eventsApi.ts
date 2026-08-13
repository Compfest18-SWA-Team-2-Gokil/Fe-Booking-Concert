import axiosInstance from '../../../core/api/axiosInstance';
import type { Event } from '../domain/Event';
import type { TicketType } from '../../inventory/domain/Ticket';

export const eventsApi = {
  getEvents: () =>
    axiosInstance.get<{ events: Event[] }>('/api/v1/events'),

  getTicketTypes: (eventId: string) =>
    axiosInstance.get<{ ticket_types: TicketType[] }>(
      `/api/v1/events/${eventId}/ticket-types`
    ),
};
