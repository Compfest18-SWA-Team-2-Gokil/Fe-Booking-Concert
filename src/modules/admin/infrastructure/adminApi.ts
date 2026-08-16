import axiosInstance from '../../../core/api/axiosInstance';

export interface DisputeOrder {
  order_id: string;
  id?: string;
  buyer_id: string;
  buyer_email: string;
  event_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface DisputesResponse {
  total: number;
  disputes: DisputeOrder[];
}

export interface OverrideOrderPayload {
  status: 'PAID' | 'CANCELLED' | 'REFUNDED' | 'PAYMENT_DISCREPANCY';
  reason: string;
}

export interface OverrideOrderResponse {
  order_id: string;
  status: string;
  message: string;
}

export interface ReassignTicketPayload {
  target_order_id: string;
  new_seat_number?: string;
  reason: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_email?: string;
  performed_by?: string;
  actor_role: string;
  entity_type?: string;
  entity_name?: string;
  entity_id: string;
  action: string;
  from_status?: string;
  to_status?: string;
  from_state?: string;
  to_state?: string;
  reason: string;
  created_at: string;
}

export interface AuditLogsResponse {
  total: number;
  audit_logs: AuditLog[];
}

export const adminApi = {
  getDisputes: () =>
    axiosInstance.get<DisputesResponse>('/api/v1/admin/disputes').then((r) => r.data),

  overrideOrderStatus: (orderId: string, payload: OverrideOrderPayload) =>
    axiosInstance
      .post<OverrideOrderResponse>(`/api/v1/admin/orders/${orderId}/override`, payload)
      .then((r) => r.data),

  reassignTicket: (unitId: string, payload: ReassignTicketPayload) =>
    axiosInstance
      .post<{ message: string }>(`/api/v1/admin/tickets/${unitId}/reassign`, payload)
      .then((r) => r.data),

  getAuditLogs: (limit = 50) =>
    axiosInstance
      .get<AuditLogsResponse>(`/api/v1/admin/audit-logs?limit=${limit}`)
      .then((r) => r.data),
};
