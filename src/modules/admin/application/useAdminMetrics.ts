import { useState } from 'react';
import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { useEvents } from '../../events/application/useEvents';
import axiosInstance from '../../../core/api/axiosInstance';
import type { Event } from '../../events/domain/models/Event';

export interface EventMetricsResponse {
  event_id: string;
  metrics: {
    ticket_type_id: string;
    available: number;
    held: number;
    sold: number;
    admitted: number;
    refunded: number;
    total: number;
  }[];
}

export function useAdminMetrics() {
  const [search, setSearch] = useState('');
  const { data: events, isLoading: eventsLoading } = useEvents();

  // Metrics for all events
  const metricQueries: UseQueryResult<EventMetricsResponse, Error>[] = useQueries({
    queries: (events ?? []).map((e: Event) => ({
      queryKey: ['metrics', e.id],
      queryFn: () =>
        axiosInstance
          .get<EventMetricsResponse>(`/api/v1/events/${e.id}/metrics`)
          .then((r) => r.data),
      refetchInterval: 15_000,
    })),
  });

  // Calculate platform totals
  const platformStats = metricQueries.reduce(
    (acc, query) => {
      if (!query.data?.metrics) return acc;
      for (const m of query.data.metrics) {
        acc.totalQuota += m.total || 0;
        acc.available += m.available || 0;
        acc.held += m.held || 0;
        acc.sold += m.sold || 0;
        acc.admitted += m.admitted || 0;
        acc.refunded += m.refunded || 0;
      }
      return acc;
    },
    { totalQuota: 0, available: 0, held: 0, sold: 0, admitted: 0, refunded: 0 }
  );

  const filteredEvents = (events ?? []).filter(
    (e: Event) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return {
    events,
    eventsLoading,
    metricQueries,
    platformStats,
    search,
    setSearch,
    filteredEvents,
  };
}
