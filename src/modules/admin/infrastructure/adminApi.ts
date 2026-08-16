import axiosInstance from '../../../core/api/axiosInstance';
import type { Order } from '../../orders/infrastructure/ordersApi';

export interface DisputesResponse {
  total: number;
  disputes: Order[];
}

export interface OverrideOrderPayload {
  status: 'PAID' | 'CANCELLED' | 'REFUNDED' | 'PAYMENT_DISCREPANCY';
  reason: string;
}

export interface OverrideOrderResponse {
  message: string;
  status: string;
}

export interface ReassignTicketPayload {
  target_order_id: string;
  new_seat_number?: string;
  reason: string;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  performed_by: string;
  reason: string;
  details?: Record<string, unknown>;
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
