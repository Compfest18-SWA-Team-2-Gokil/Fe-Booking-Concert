import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEvents } from '../../events/application/useEvents';
import { useAuth } from '../../auth/application/useAuth';
import { eventsApi } from '../../events/infrastructure/eventsApi';
import type { Event } from '../../events/domain/models/Event';
import { showAlert, showToast } from '../../../shared/utils/alert';

export function useOrganizerEvents() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: events, isLoading } = useEvents();
  const [search, setSearch] = useState('');
  const [metricEventId, setMetricEventId] = useState<string | null>(null);

  const myEvents = useMemo(() => {
    return (events ?? []).filter((e: Event) => e.organizer_id === user?.id);
  }, [events, user?.id]);

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
    onError: (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
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
    isLoading,
    handleDelete,
    isDeleting: deleteEvent.isPending,
  };
}
