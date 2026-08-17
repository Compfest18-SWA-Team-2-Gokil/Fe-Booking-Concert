import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../events/infrastructure/eventsApi';
import axiosInstance from '../../../core/api/axiosInstance';
import type { TicketType } from '../../inventory/domain/Ticket';
import { showAlert, showToast } from '../../../shared/utils/alert';

export function useTicketTypesManagement() {
  const { eventId } = useParams<{ eventId: string }>();
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [kind, setKind] = useState<'GA' | 'SEATED'>('GA');
  const [quota, setQuota] = useState('');

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getEvent(eventId!).then((r) => r.data),
    enabled: !!eventId,
  });

  const { data: ticketTypes = [], isLoading: isLoadingTypes } = useQuery<TicketType[]>({
    queryKey: ['ticketTypes', eventId],
    queryFn: () =>
      eventsApi.getTicketTypes(eventId!).then((r) => r.data.ticket_types ?? []),
    enabled: !!eventId,
  });

  const createType = useMutation({
    mutationFn: (payload: { name: string; price: number; kind: 'GA' | 'SEATED'; total_quota: number }) =>
      axiosInstance.post<TicketType>(`/api/v1/events/${eventId}/ticket-types`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticketTypes', eventId] });
      qc.invalidateQueries({ queryKey: ['events'] });
      setName('');
      setPrice('');
      setQuota('');
      showToast.success('Ticket type berhasil dibuat.');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error ?? 'Gagal membuat ticket type.';
      showAlert.error('Gagal Membuat Ticket Type', msg);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price || !quota) return;
    createType.mutate({
      name,
      price: Number(price),
      kind,
      total_quota: Number(quota),
    });
  }

  return {
    eventId,
    event,
    ticketTypes,
    isLoading: isLoadingEvent || isLoadingTypes,
    name,
    setName,
    price,
    setPrice,
    kind,
    setKind,
    quota,
    setQuota,
    handleSubmit,
    isSubmitting: createType.isPending,
  };
}
