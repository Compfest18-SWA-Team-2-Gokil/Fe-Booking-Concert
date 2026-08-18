import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ticketApi } from '../infrastructure/ticketApi';
import { showAlert } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

type QueueStep = 'idle' | 'waiting' | 'ready';

interface QueueStatusResponse {
  status: 'waiting' | 'ready';
  position?: number;
  queue_token?: string;
}

export function useQueue(eventId: string, userId: string) {
  const [step, setStep] = useState<QueueStep>('idle');
  const [queueToken, setQueueToken] = useState<string | null>(null);

  const joinMutation = useMutation({
    mutationFn: () => ticketApi.joinQueue(eventId, userId).then((r) => r.data),
    onSuccess: (data) => {
      if (data.status === 'direct') {
        setStep('ready');
      } else {
        setStep('waiting');
      }
    },
    onError: (err: unknown) => {
      showAlert.error(
        'Gagal Bergabung ke Antrian',
        getApiErrorMessage(err, 'Terjadi kesalahan saat menghubungkan ke antrian. Silakan coba lagi.')
      );
    },
  });

  const statusQuery = useQuery<QueueStatusResponse>({
    queryKey: ['queue-status', eventId, userId],
    queryFn: () =>
      ticketApi.getQueueStatus(eventId, userId).then((r) => r.data),
    enabled: step === 'waiting',
    refetchInterval: step === 'waiting' ? 3000 : false,
    retry: 2,
  });

  // Antrian gagal dipoll berkali-kali (mis. server down) — hentikan polling diam-diam
  // dan beri tahu user daripada membiarkan spinner antrian berputar selamanya.
  if (step === 'waiting' && statusQuery.isError) {
    setStep('idle');
    showAlert.error(
      'Gagal Memeriksa Status Antrian',
      getApiErrorMessage(statusQuery.error, 'Koneksi ke server antrian terputus. Silakan coba bergabung kembali.')
    );
  }

  // Derived: check if we moved to ready
  if (
    step === 'waiting' &&
    statusQuery.data?.status === 'ready' &&
    statusQuery.data.queue_token
  ) {
    setStep('ready');
    setQueueToken(statusQuery.data.queue_token);
  }

  const validateTokenMutation = useMutation({
    mutationFn: (token: string) =>
      ticketApi.validateQueueToken(token).then((r) => r.data),
  });

  return {
    step,
    queueToken,
    position:
      statusQuery.data?.status === 'waiting'
        ? statusQuery.data.position
        : undefined,
    joinQueue: joinMutation.mutate,
    isJoining: joinMutation.isPending,
    joinError: joinMutation.error,
    validateToken: validateTokenMutation.mutateAsync,
    isValidatingToken: validateTokenMutation.isPending,
  };
}

