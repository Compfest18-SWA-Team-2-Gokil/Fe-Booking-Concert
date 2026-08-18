import { useState, useMemo } from 'react';
import { useMutation, useQueryClient, useQueries, type UseQueryResult } from '@tanstack/react-query';
import { useEvents } from '../../events/application/useEvents';
import { useAuth } from '../../auth/application/useAuth';
import { eventsApi } from '../../events/infrastructure/eventsApi';
import axiosInstance from '../../../core/api/axiosInstance';
import type { Event } from '../../events/domain/models/Event';
import { showAlert, showToast } from '../../../shared/utils/alert';

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

export function useOrganizerEvents() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const [search, setSearch] = useState('');
  const [metricEventId, setMetricEventId] = useState<string | null>(null);

  const myEvents = useMemo(() => {
    return (events ?? []).filter((e: Event) => e.organizer_id === user?.id);
  }, [events, user?.id]);

  // Metrics for my events
  const metricQueries: UseQueryResult<EventMetricsResponse, Error>[] = useQueries({
    queries: myEvents.map((e: Event) => ({
      queryKey: ['organizer-metrics', e.id],
      queryFn: () =>
        axiosInstance
          .get<EventMetricsResponse>(`/api/v1/events/${e.id}/metrics`)
          .then((r) => r.data),
      refetchInterval: 10_000,
    })),
  });

  // Calculate organizer totals
  const organizerStats = metricQueries.reduce(
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

  const filteredEvents = useMemo(() => {
    const q = search.toLowerCase();
    return myEvents.filter((e: Event) =>
      e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );
  }, [myEvents, search]);

  const deleteEvent = useMutation({
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      showToast.success('Event berhasil dihapus.');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error ?? 'Terjadi kesalahan.';
      showAlert.error('Gagal Menghapus Event', msg);
    },
  });

  async function handleDelete(eventId: string, eventName: string) {
    const confirmed = await showAlert.confirm({
      title: 'Hapus Event?',
      text: `"${eventName}" akan dihapus permanen. Lanjutkan?`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      icon: 'warning',
    });
    if (confirmed) deleteEvent.mutate(eventId);
  }

  return {
    search,
    setSearch,
    metricEventId,
    setMetricEventId,
    myEvents,
    filteredEvents,
    metricQueries,
    organizerStats,
    isLoading: eventsLoading,
    handleDelete,
    isDeleting: deleteEvent.isPending,
  };
}
