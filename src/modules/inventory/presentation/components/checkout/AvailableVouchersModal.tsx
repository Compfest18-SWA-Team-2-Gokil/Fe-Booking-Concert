import { Tag, X } from 'lucide-react';
import type { Promo } from '../../../../admin/infrastructure/promosApi';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface AvailableVouchersModalProps {
  isOpen: boolean;
  vouchers: Promo[];
  isValidating: boolean;
  onClose: () => void;
  onSelectVoucher: (code: string) => void;
}

export function AvailableVouchersModal({
  isOpen,
  vouchers,
  isValidating,
  onClose,
  onSelectVoucher,
}: AvailableVouchersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 max-h-[85vh] flex flex-col">
        <div className="bg-[#0064D2] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            <h3 className="font-black text-base">Pilih Voucher Belanja</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {vouchers.map((p) => {
            const discountTitle =
              p.discount_type === 'PERCENTAGE' ? `Diskon ${p.discount_value}%` : `Potongan ${formatCurrency(p.discount_value)}`;

            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-gray-200 hover:border-[#0064D2] hover:bg-blue-50/40 transition-all flex flex-col justify-between gap-3 bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs bg-blue-100 text-[#0064D2] px-2.5 py-0.5 rounded-md">
                      {p.code}
                    </span>
                    <span className="font-extrabold text-emerald-600 text-xs">{discountTitle}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{p.title}</h4>
                  {p.description && <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{p.description}</p>}
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    Min. Belanja: {p.min_order_amount > 0 ? formatCurrency(p.min_order_amount) : 'Tanpa Minimum'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectVoucher(p.code)}
                  disabled={isValidating}
                  className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isValidating ? 'Menerapkan...' : 'Gunakan Voucher Ini'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
