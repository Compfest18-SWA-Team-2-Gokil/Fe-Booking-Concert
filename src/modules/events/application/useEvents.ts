import { useQuery } from '@tanstack/react-query';
import { eventsApi, type ListEventsFilter, type ListEventsResponse } from '../infrastructure/eventsApi';
import type { Event } from '../domain/models/Event';

export function useEvents(filter: ListEventsFilter = {}) {
  const query = useQuery<ListEventsResponse>({
    queryKey: ['events', filter],
    queryFn: () => eventsApi.getEvents(filter).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  return {
    events: query.data?.events ?? [],
    data: query.data?.events ?? [], // kompatibilitas ke code lama
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useEvent(id: string) {
  return useQuery<Event>({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEvent(id).then((r) => r.data),
    enabled: !!id,
  });
}
