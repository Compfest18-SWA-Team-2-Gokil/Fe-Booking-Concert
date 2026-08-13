import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ticketApi } from '../infrastructure/ticketApi';

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
  });

  const statusQuery = useQuery<QueueStatusResponse>({
    queryKey: ['queue-status', eventId, userId],
    queryFn: () =>
      ticketApi.getQueueStatus(eventId, userId).then((r) => r.data),
    enabled: step === 'waiting',
    refetchInterval: step === 'waiting' ? 3000 : false,
  });

  // Derived: check if we moved to ready
  if (
    step === 'waiting' &&
    statusQuery.data?.status === 'ready' &&
    statusQuery.data.queue_token
  ) {
    setStep('ready');
    setQueueToken(statusQuery.data.queue_token);
  }

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
  };
}
