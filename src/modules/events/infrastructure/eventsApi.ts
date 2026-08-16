import axiosInstance from '../../../core/api/axiosInstance';
import type { Event, EventCategory } from '../domain/models/Event';
import type { TicketType } from '../../inventory/domain/Ticket';
import type { PaginationMeta } from '../../../shared/components/ui/Pagination';

export interface ListEventsFilter {
  category?: EventCategory | '';
  page?: number;
  limit?: number;
}

export interface ListEventsResponse {
  events: Event[];
  pagination?: PaginationMeta;
}

export interface CreateEventPayload {
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  location: string;
}

export interface UpdateEventPayload {
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  location: string;
}

export const eventsApi = {
  getEvents: (filter: ListEventsFilter = {}) => {
    const params = new URLSearchParams();
    if (filter.category) params.set('category', filter.category);
    if (filter.page) params.set('page', String(filter.page));
    if (filter.limit) params.set('limit', String(filter.limit));
    const qs = params.toString();
    return axiosInstance.get<ListEventsResponse>(`/api/v1/events${qs ? `?${qs}` : ''}`);
  },

  getEvent: (id: string) =>
    axiosInstance.get<Event>(`/api/v1/events/${id}`),

  createEvent: (payload: CreateEventPayload) =>
    axiosInstance.post<Event>('/api/v1/events', payload),

  updateEvent: (id: string, payload: UpdateEventPayload) =>
    axiosInstance.put<Event>(`/api/v1/events/${id}`, payload),

  deleteEvent: (id: string) =>
    axiosInstance.delete(`/api/v1/events/${id}`),

  getTicketTypes: (eventId: string) =>
    axiosInstance.get<{ ticket_types: TicketType[] }>(
      `/api/v1/events/${eventId}/ticket-types`
    ),

  updateTicketType: (
    eventId: string,
    ticketTypeId: string,
    payload: { name: string; price: number; total_quota: number }
  ) =>
    axiosInstance.put<TicketType>(
      `/api/v1/events/${eventId}/ticket-types/${ticketTypeId}`,
      payload
    ),

  deleteTicketType: (eventId: string, ticketTypeId: string) =>
    axiosInstance.delete(`/api/v1/events/${eventId}/ticket-types/${ticketTypeId}`),
};
