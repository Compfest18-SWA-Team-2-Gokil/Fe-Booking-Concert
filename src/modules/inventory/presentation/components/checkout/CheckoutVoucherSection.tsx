import { Tag, Sparkles, ChevronRight, Percent, X } from 'lucide-react';
import type { ValidatePromoResponse, Promo } from '../../../../admin/infrastructure/promosApi';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface CheckoutVoucherSectionProps {
  hasSelection: boolean;
  availableVouchers: Promo[];
  appliedVoucher: ValidatePromoResponse | null;
  voucherCodeInput: string;
  isValidating: boolean;
  onCodeInputChange: (code: string) => void;
  onApplyVoucher: (e: React.FormEvent) => void;
  onRemoveVoucher: () => void;
  onOpenVoucherModal: () => void;
}

export function CheckoutVoucherSection({
  hasSelection,
  availableVouchers,
  appliedVoucher,
  voucherCodeInput,
  isValidating,
  onCodeInputChange,
  onApplyVoucher,
  onRemoveVoucher,
  onOpenVoucherModal,
}: CheckoutVoucherSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#0064D2]" />
          <h3 className="text-sm font-black text-gray-900">Punya Voucher Belanja Tambahan?</h3>
        </div>

        {availableVouchers.length > 0 && !appliedVoucher && (
          <button
            type="button"
            onClick={onOpenVoucherModal}
            disabled={!hasSelection}
            className="text-xs font-bold text-[#0064D2] hover:text-[#0052B0] flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Voucher Belanja ({availableVouchers.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {appliedVoucher ? (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-900 uppercase">
                Voucher {appliedVoucher.code} Diterapkan
              </p>
              <p className="text-[11px] text-emerald-700 font-medium">
                Hemat ekstra {formatCurrency(appliedVoucher.discount_amount)} ({appliedVoucher.title})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveVoucher}
            className="text-xs text-red-600 hover:text-red-800 font-bold p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      ) : (
        <form onSubmit={onApplyVoucher} className="flex gap-2">
          <input
            type="text"
            value={voucherCodeInput}
            onChange={(e) => onCodeInputChange(e.target.value.toUpperCase())}
            placeholder="Masukkan kode voucher (cth. COMPFEST50K)"
            disabled={!hasSelection}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#0064D2] disabled:bg-gray-50 uppercase"
          />
          <button
            type="submit"
            disabled={!hasSelection || !voucherCodeInput.trim() || isValidating}
            className="bg-[#0064D2] hover:bg-[#0052B0] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm disabled:opacity-40 cursor-pointer shrink-0"
          >
            {isValidating ? 'Mengecek...' : 'Terapkan Voucher'}
          </button>
        </form>
      )}
    </div>
  );
}
