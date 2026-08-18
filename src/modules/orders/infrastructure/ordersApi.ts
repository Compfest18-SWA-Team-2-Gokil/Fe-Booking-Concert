import axiosInstance from '../../../core/api/axiosInstance';
import type { PaginationMeta } from '../../../shared/components/ui/Pagination';

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CANCELLED'
  | 'REFUND_REQUESTED'
  | 'REFUND_ORGANIZER_APPROVED'
  | 'REFUNDED'
  | 'PAYMENT_DISCREPANCY';

export interface Order {
  id: string;
  buyer_id: string;
  event_id: string;
  event_name?: string;
  status: OrderStatus;
  total_amount: number;
  unit_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface StoredOrder {
  orderId: string;
  eventId: string;
  eventName: string;
  unitIds: string[];
  totalAmount: number;
  createdAt: string;
}

export interface MyOrdersResponse {
  orders: Order[];
  pagination?: PaginationMeta;
}

export interface OrganizerRefundItem {
  order_id: string;
  buyer_id: string;
  buyer_email: string;
  event_id: string;
  event_name: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
}

export interface OrganizerRefundsResponse {
  refunds: OrganizerRefundItem[];
  pagination?: PaginationMeta;
}

const STORAGE_KEY = 'tiketin_orders';

export function getStoredOrders(): StoredOrder[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function storeOrder(order: StoredOrder): void {
  const existing = getStoredOrders().filter((o) => o.orderId !== order.orderId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...existing]));
}

export function createOrder(eventId: string, unitIds: string[], queueToken?: string | null): Promise<Order> {
  const headers: Record<string, string> = {};
  if (queueToken) {
    headers['X-Queue-Token'] = queueToken;
  }
  return axiosInstance
    .post<Order>('/api/v1/orders', { event_id: eventId, unit_ids: unitIds }, { headers })
    .then((r) => r.data);
}

export function getOrder(orderId: string): Promise<Order> {
  return axiosInstance.get<Order>(`/api/v1/orders/${orderId}`).then((r) => r.data);
}

export function getMyOrders(page = 1, limit = 10): Promise<MyOrdersResponse> {
  return axiosInstance
    .get<MyOrdersResponse>(`/api/v1/orders/my?page=${page}&limit=${limit}`)
    .then((r) => r.data);
}

export function getOrganizerRefunds(page = 1, limit = 10): Promise<OrganizerRefundsResponse> {
  return axiosInstance
    .get<OrganizerRefundsResponse>(`/api/v1/orders/organizer/refunds?page=${page}&limit=${limit}`)
    .then((r) => r.data);
}

export function initiatePayment(orderId: string): Promise<{ payment_id: string; invoice_url: string }> {
  return axiosInstance
    .post<{ payment_id: string; invoice_url: string }>(`/api/v1/orders/${orderId}/pay`)
    .then((r) => r.data);
}

export function requestRefund(orderId: string): Promise<{ status: string }> {
  return axiosInstance
    .post<{ status: string }>(`/api/v1/orders/${orderId}/refund`)
    .then((r) => r.data);
}

export function approveRefund(orderId: string): Promise<{ status: string }> {
  return axiosInstance
    .post<{ status: string }>(`/api/v1/orders/${orderId}/refund/approve`)
    .then((r) => r.data);
}
