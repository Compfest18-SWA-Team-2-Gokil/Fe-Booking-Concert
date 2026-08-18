import { Copy, Calendar, Clock, Ticket } from 'lucide-react';
import type { Promo } from '../../../../admin/infrastructure/promosApi';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface BuyerPromoCardProps {
  promo: Promo;
  onCopy: (code: string) => void;
  onUsePromo: (eventId?: string) => void;
}

export function BuyerPromoCard({ promo, onCopy, onUsePromo }: BuyerPromoCardProps) {
  const isPromoEvent = promo.type === 'PROMO' || Boolean(promo.event_id);
  const discountTitle =
    promo.discount_type === 'PERCENTAGE'
      ? `Diskon ${promo.discount_value}%`
      : `Potongan ${formatCurrency(promo.discount_value)}`;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
      <div
        className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl pointer-events-none opacity-20 ${
          isPromoEvent ? 'bg-orange-500' : 'bg-blue-600'
        }`}
      />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg ${
              isPromoEvent
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'bg-blue-50 text-[#0064D2] border border-blue-200'
            }`}
          >
            {isPromoEvent ? '🔥 Promo Event' : '🌐 Voucher Global'}
          </span>
          <span className="font-extrabold text-emerald-600 text-sm">{discountTitle}</span>
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-1">{promo.title}</h3>
        {promo.description && <p className="text-xs text-gray-500 mb-4 line-clamp-2">{promo.description}</p>}

        <div className="space-y-2 text-xs text-gray-600 mb-5 bg-gray-50/80 p-3.5 rounded-2xl">
          {isPromoEvent && promo.event_name && (
            <div className="flex items-center gap-2 font-semibold text-purple-700">
              <Calendar className="w-4 h-4 shrink-0 text-purple-600" />
              <span className="truncate">Khusus Event: {promo.event_name}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Min. Belanja:</span>
            <span className="font-bold text-gray-800">
              {promo.min_order_amount > 0 ? formatCurrency(promo.min_order_amount) : 'Tanpa Minimum'}
            </span>
          </div>

          {promo.discount_type === 'PERCENTAGE' && promo.max_discount_amount > 0 && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Maks. Potongan:</span>
              <span className="font-bold text-gray-800">{formatCurrency(promo.max_discount_amount)}</span>
            </div>
          )}

          {promo.end_date && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold pt-1 border-t border-gray-200/60">
              <Clock className="w-3.5 h-3.5" />
              <span>Berlaku hingga: {new Date(promo.end_date).toLocaleDateString('id-ID')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200/80 px-3 py-1.5 rounded-xl">
          <span className="font-mono font-black text-xs text-gray-900 tracking-wider">{promo.code}</span>
          <button
            onClick={() => onCopy(promo.code)}
            title="Salin Kode"
            className="text-gray-400 hover:text-gray-800 p-0.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => onUsePromo(isPromoEvent && promo.event_id ? promo.event_id : undefined)}
          className={`text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
            isPromoEvent ? 'bg-orange-600 hover:bg-orange-700' : 'bg-[#0064D2] hover:bg-[#0052B0]'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>{isPromoEvent && promo.event_id ? 'Pakai di Event Ini' : 'Gunakan Voucher'}</span>
        </button>
      </div>
    </div>
  );
}
