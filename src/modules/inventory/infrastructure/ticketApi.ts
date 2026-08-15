import axiosInstance from '../../../core/api/axiosInstance';
import type { HoldItem, HoldResponse } from '../domain/Ticket';

interface QueueJoinResponse {
  status: 'direct' | 'waiting';
  position?: number;
}

interface QueueStatusResponse {
  status: 'waiting' | 'ready';
  position?: number;
  queue_token?: string;
}

export const ticketApi = {
  holdTickets: (items: HoldItem[]) =>
    axiosInstance.post<HoldResponse>('/api/v1/tickets/hold', { items }),

  joinQueue: (eventId: string, userId: string) =>
    axiosInstance.post<QueueJoinResponse>(
      `/api/v1/events/${eventId}/queue/join`,
      { user_id: userId }
    ),

  getQueueStatus: (eventId: string, userId: string) =>
    axiosInstance.get<QueueStatusResponse>(
      `/api/v1/events/${eventId}/queue/status`,
      { params: { user_id: userId } }
    ),

  validateQueueToken: (queueToken: string) =>
    axiosInstance.post<{ user_id: string; event_id: string }>(
      '/api/v1/queue/token/validate',
      null,
      { headers: { 'X-Queue-Token': queueToken } }
    ),
};
