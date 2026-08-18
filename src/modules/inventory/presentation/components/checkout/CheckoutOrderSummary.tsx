import { Ticket } from 'lucide-react';
import type { Promo, ValidatePromoResponse } from '../../../../admin/infrastructure/promosApi';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface CheckoutOrderSummaryProps {
  rawSubtotal: number;
  promoDiscountAmount: number;
  voucherDiscountAmount: number;
  finalPayAmount: number;
  eventPromo?: Promo;
  appliedVoucher: ValidatePromoResponse | null;
  hasSelection: boolean;
  isHolding: boolean;
  onHold: () => void;
}

export function CheckoutOrderSummary({
  rawSubtotal,
  promoDiscountAmount,
  voucherDiscountAmount,
  finalPayAmount,
  eventPromo,
  appliedVoucher,
  hasSelection,
  isHolding,
  onHold,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal Harga Tiket</span>
          <span className={`font-bold ${promoDiscountAmount > 0 ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {formatCurrency(rawSubtotal)}
          </span>
        </div>

        {promoDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-sm text-orange-600 font-bold">
            <span>Potongan Promo Event ({eventPromo?.title})</span>
            <span>-{formatCurrency(promoDiscountAmount)}</span>
          </div>
        )}

        {appliedVoucher && (
          <div className="flex justify-between items-center text-sm text-emerald-600 font-bold">
            <span>Potongan Voucher Belanja ({appliedVoucher.code})</span>
            <span>-{formatCurrency(voucherDiscountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Total Pembayaran</span>
            <p className="text-xs text-gray-500 mt-0.5">Sudah termasuk pajak & fee layanan</p>
          </div>
          <span className="font-black text-3xl text-gray-900">
            {formatCurrency(finalPayAmount)}
          </span>
        </div>
      </div>

      <button
        onClick={onHold}
        disabled={!hasSelection || isHolding}
        className="w-full bg-gradient-to-r from-[#FF6100] to-orange-600 hover:from-[#E55500] hover:to-orange-700 text-white py-4 rounded-2xl font-extrabold text-lg shadow-xl shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>{isHolding ? 'Mereservasi Tiket...' : 'Reservasi Tiket Sekarang'}</span>
        <Ticket className="w-5 h-5" />
      </button>
    </div>
  );
}
