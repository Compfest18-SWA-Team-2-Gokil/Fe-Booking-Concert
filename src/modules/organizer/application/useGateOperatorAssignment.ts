import { getApiErrorMessage } from '../../../shared/utils/apiError';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../events/infrastructure/eventsApi';
import axiosInstance from '../../../core/api/axiosInstance';
import { showAlert, showToast } from '../../../shared/utils/alert';
import type { AssignedOperator } from '../domain/types';

export function useGateOperatorAssignment() {
  const { eventId } = useParams<{ eventId: string }>();
  const [usernameOperator, setUsernameOperator] = useState('');
  const queryClient = useQueryClient();

  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getEvent(eventId!).then((r) => r.data),
    enabled: !!eventId,
  });

  const { data: assignedOperators = [], isLoading: isListLoading } = useQuery<AssignedOperator[]>({
    queryKey: ['gate-operators', eventId],
    queryFn: () =>
      axiosInstance
        .get(`/api/v1/events/${eventId}/gate-operators`)
        .then((r) => r.data || []),
    enabled: !!eventId,
  });

  const assign = useMutation({
    mutationFn: (username: string) =>
      axiosInstance.post(`/api/v1/events/${eventId}/gate-operators`, {
        username,
      }),
    onSuccess: () => {
      setUsernameOperator('');
      queryClient.invalidateQueries({ queryKey: ['gate-operators', eventId] });
      showToast.success('Gate Operator berhasil ditugaskan.');
    },
    onError: (err: unknown) => {
      showAlert.error('Gagal Assign Gate Operator', getApiErrorMessage(err, 'Gagal menugaskan Gate Operator.'));
    },
  });

  const revoke = useMutation({
    mutationFn: (userId: string) =>
      axiosInstance.delete(`/api/v1/events/${eventId}/gate-operators/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gate-operators', eventId] });
      showToast.success('Gate Operator berhasil dicabut.');
    },
    onError: (err: unknown) => {
      showAlert.error('Gagal Revoke Gate Operator', getApiErrorMessage(err, 'Gagal mencabut Gate Operator.'));
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usernameOperator.trim()) return;
    assign.mutate(usernameOperator.trim());
  }

  function handleRevoke(userId: string) {
    revoke.mutate(userId);
  }

  return {
    eventId,
    event,
    isLoading: isEventLoading,
    isListLoading,
    usernameOperator,
    setUsernameOperator,
    assignedOperators,
    handleSubmit,
    handleRevoke,
    isSubmitting: assign.isPending,
    isRevoking: revoke.isPending,
  };
}
