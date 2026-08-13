import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../infrastructure/eventsApi';
import type { Event } from '../domain/models/Event';

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => eventsApi.getEvents().then((r) => r.data.events),
  });
}
