import axiosInstance from '../../../core/api/axiosInstance';

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CANCELLED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED';

export interface Order {
  id: string;
  buyer_id: string;
  event_id: string;
  status: OrderStatus;
  total_amount: number;
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

export function createOrder(eventId: string, unitIds: string[]): Promise<Order> {
  return axiosInstance
    .post<Order>(
      '/api/v1/orders',
      { event_id: eventId, unit_ids: unitIds },
      { headers: { 'Idempotency-Key': crypto.randomUUID() } }
    )
    .then((r) => r.data);
}

export function getOrder(orderId: string): Promise<Order> {
  return axiosInstance.get<Order>(`/api/v1/orders/${orderId}`).then((r) => r.data);
}

export function initiatePayment(orderId: string): Promise<{ payment_id: string; invoice_url: string }> {
  return axiosInstance
    .post<{ payment_id: string; invoice_url: string }>(
      `/api/v1/orders/${orderId}/pay`,
      null,
      { headers: { 'Idempotency-Key': crypto.randomUUID() } }
    )
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
