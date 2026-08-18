import type { TicketType } from '../../domain/Ticket';
import type { Promo } from '../../../admin/infrastructure/promosApi';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import { Ticket, AlertCircle, CheckCircle2, Percent } from 'lucide-react';

interface TicketCardProps {
  ticketType: TicketType;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  eventPromo?: Promo | null;
}

export function TicketCard({ ticketType, quantity, onQuantityChange, eventPromo }: TicketCardProps) {
  const effectiveQuota = ticketType.available_quota !== undefined ? ticketType.available_quota : ticketType.total_quota;
  const isSoldOut = effectiveQuota <= 0;
  const isLimited = effectiveQuota > 0 && effectiveQuota <= 10;

  // Hitung diskon promo event otomatis jika ada
  let discountedPrice: number | null = null;
  if (eventPromo) {
    let disc = 0;
    if (eventPromo.discount_type === 'PERCENTAGE') {
      disc = (ticketType.price * eventPromo.discount_value) / 100;
      if (eventPromo.max_discount_amount > 0 && disc > eventPromo.max_discount_amount) {
        disc = eventPromo.max_discount_amount;
      }
    } else {
      disc = eventPromo.discount_value;
    }
    discountedPrice = Math.max(0, ticketType.price - disc);
  }

  const effectivePrice = discountedPrice !== null ? discountedPrice : ticketType.price;

  return (
    <div
      className={`rounded-3xl p-6 transition-all border ${
        isSoldOut
          ? 'bg-gray-50/80 border-gray-200/80 opacity-75'
          : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-black text-lg ${isSoldOut ? 'text-gray-500' : 'text-gray-900'}`}>
              {ticketType.name}
            </h3>
            <span className="text-xs bg-blue-50 text-[#0064D2] px-2.5 py-0.5 rounded-full font-bold">
              {ticketType.kind === 'GA' ? 'General Admission' : 'Seated Category'}
            </span>
          </div>

          {/* Status badge ala Loket.com */}
          <div className="mt-2.5 flex items-center gap-2">
            {isSoldOut ? (
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                Habis Terjual (Sold Out)
              </span>
            ) : isLimited ? (
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full animate-pulse">
                <Ticket className="w-3.5 h-3.5" />
                Sisa {effectiveQuota} Tiket Lagi!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tersedia ({effectiveQuota} Kuota)
              </span>
            )}
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Harga / Tiket</p>
          {isSoldOut ? (
            <p className="font-black text-2xl text-gray-400 line-through">
              {formatCurrency(ticketType.price)}
            </p>
          ) : discountedPrice !== null ? (
            <div className="flex flex-col sm:items-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <Percent className="w-3 h-3" />
                  {eventPromo?.discount_type === 'PERCENTAGE'
                    ? `Diskon ${eventPromo?.discount_value}%`
                    : `Hemat ${formatCurrency(eventPromo?.discount_value ?? 0)}`}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-black text-2xl text-[#FF385C]">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(ticketType.price)}
                </span>
              </div>
            </div>
          ) : (
            <p className="font-black text-2xl text-gray-900">
              {formatCurrency(ticketType.price)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {isSoldOut ? 'Tiket Tidak Tersedia' : 'Pilih Jumlah Tiket'}
        </span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-800 hover:bg-gray-200 transition-colors disabled:opacity-40 cursor-pointer"
              disabled={quantity === 0 || isSoldOut}
            >
              −
            </button>
            <span className="w-8 text-center font-extrabold text-gray-900 text-sm">{quantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(effectiveQuota, quantity + 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-800 hover:bg-gray-200 transition-colors disabled:opacity-40 cursor-pointer"
              disabled={quantity >= effectiveQuota || isSoldOut}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {quantity > 0 && (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal Kategori</span>
          <div className="flex items-baseline gap-2">
            {discountedPrice !== null && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(ticketType.price * quantity)}
              </span>
            )}
            <span className="font-extrabold text-[#0064D2]">
              {formatCurrency(effectivePrice * quantity)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
