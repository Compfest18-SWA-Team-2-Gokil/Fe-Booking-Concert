import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { eventsApi } from '../../events/infrastructure/eventsApi';
import axiosInstance from '../../../core/api/axiosInstance';
import { showAlert, showToast } from '../../../shared/utils/alert';

export function useGateOperatorAssignment() {
  const { eventId } = useParams<{ eventId: string }>();
  const [operatorId, setOperatorId] = useState('');
  const [assigned, setAssigned] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getEvent(eventId!).then((r) => r.data),
    enabled: !!eventId,
  });

  const assign = useMutation({
    mutationFn: (opId: string) =>
      axiosInstance.post(`/api/v1/events/${eventId}/gate-operators`, {
        gate_operator_id: opId,
      }),
    onSuccess: (_, opId) => {
      setAssigned(opId);
      setOperatorId('');
      showToast.success('Gate Operator berhasil ditugaskan.');
    },
    onError: (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      const msg = err?.response?.data?.error ?? 'Gagal menugaskan Gate Operator.';
      showAlert.error('Gagal Assign Gate Operator', msg);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!operatorId.trim()) return;
    assign.mutate(operatorId.trim());
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast.success('ID Operator berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  }

  return {
    eventId,
    event,
    isLoading,
    operatorId,
    setOperatorId,
    assigned,
    copied,
    handleSubmit,
    handleCopy,
    isSubmitting: assign.isPending,
  };
}
