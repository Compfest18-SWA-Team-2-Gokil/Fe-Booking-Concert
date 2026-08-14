import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../infrastructure/eventsApi';
import type { ListEventsFilter } from '../infrastructure/eventsApi';
import type { Event } from '../domain/models/Event';

export function useEvents(filter: ListEventsFilter = {}) {
  return useQuery<Event[]>({
    queryKey: ['events', filter],
    queryFn: () => eventsApi.getEvents(filter).then((r) => r.data.events ?? []),
  });
}

export function useEvent(id: string) {
  return useQuery<Event>({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEvent(id).then((r) => r.data),
    enabled: !!id,
  });
}
