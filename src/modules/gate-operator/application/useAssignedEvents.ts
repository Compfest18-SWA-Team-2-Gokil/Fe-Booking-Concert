import { useQuery } from '@tanstack/react-query';
import { checkinApi } from '../infrastructure/checkinApi';
import type { AssignedEvent } from '../infrastructure/checkinApi';

export function useAssignedEvents() {
  return useQuery<AssignedEvent[], Error>({
    queryKey: ['gate-operator-assigned-events'],
    queryFn: checkinApi.getMyAssignedEvents,
    staleTime: 1000 * 60 * 2, // 2 menit
    refetchOnWindowFocus: true,
  });
}
