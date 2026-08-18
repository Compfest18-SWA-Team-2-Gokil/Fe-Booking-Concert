import axiosInstance from '../../../core/api/axiosInstance';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type PromoType = 'VOUCHER' | 'PROMO';

export interface Promo {
  id: string;
  code: string;
  title: string;
  description: string;
  type: PromoType;
  event_id?: string | null;
  event_name?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number;
  max_usage: number;
  used_count: number;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePromoPayload {
  code: string;
  title: string;
  description?: string;
  type: PromoType;
  event_id?: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  max_usage?: number;
  is_active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
}

export interface UpdatePromoPayload {
  code: string;
  title: string;
  description?: string;
  type: PromoType;
  event_id?: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  max_usage?: number;
  is_active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
}

export interface ValidatePromoPayload {
  code: string;
  total_amount: number;
  event_id?: string;
}

export interface ValidatePromoResponse {
  code: string;
  title: string;
  type: PromoType;
  event_id?: string | null;
  event_name?: string;
  discount_type: DiscountType;
  discount_value: number;
  discount_amount: number;
  final_amount: number;
}

export const promosApi = {
  getAdminPromos: () =>
    axiosInstance.get<{ promos: Promo[] }>('/api/v1/admin/promos').then((r) => r.data.promos ?? []),

  createAdminPromo: (payload: CreatePromoPayload) =>
    axiosInstance.post<Promo>('/api/v1/admin/promos', payload).then((r) => r.data),

  updateAdminPromo: (id: string, payload: UpdatePromoPayload) =>
    axiosInstance.put<Promo>(`/api/v1/admin/promos/${id}`, payload).then((r) => r.data),

  deleteAdminPromo: (id: string) =>
    axiosInstance.delete(`/api/v1/admin/promos/${id}`).then((r) => r.data),

  validatePromo: (payload: ValidatePromoPayload) =>
    axiosInstance.post<ValidatePromoResponse>('/api/v1/promos/validate', payload).then((r) => r.data),

  getActivePromos: () =>
    axiosInstance.get<{ promos: Promo[] }>('/api/v1/promos/active').then((r) => r.data.promos ?? []),
};
