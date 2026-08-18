import { Flame } from 'lucide-react';
import type { Promo } from '../../../../admin/infrastructure/promosApi';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface CheckoutPromoBannerProps {
  promo: Promo;
}

export function CheckoutPromoBanner({ promo }: CheckoutPromoBannerProps) {
  return (
    <div className="mt-4 p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
        <Flame className="w-4 h-4" />
      </div>
      <div className="text-xs">
        <p className="font-bold text-orange-900">
          Promo Event Otomatis Aktif: {promo.title}
        </p>
        <p className="text-orange-700 font-medium">
          Harga tiket di bawah sudah otomatis dipotong diskon{' '}
          {promo.discount_type === 'PERCENTAGE' ? `${promo.discount_value}%` : formatCurrency(promo.discount_value)}!
        </p>
      </div>
    </div>
  );
}
