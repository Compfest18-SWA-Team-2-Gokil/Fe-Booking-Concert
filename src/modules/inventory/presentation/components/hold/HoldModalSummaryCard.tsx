import { Clock, Ticket, AlertCircle, CheckCircle2, Tag } from 'lucide-react';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface HoldModalSummaryCardProps {
  eventName: string;
  ticketCount: number;
  promoCode?: string;
  discountAmount: number;
  totalAmount: number;
  finalAmount: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function HoldModalSummaryCard({
  eventName,
  ticketCount,
  promoCode,
  discountAmount,
  finalAmount,
  minutes,
  seconds,
  isExpired,
}: HoldModalSummaryCardProps) {
  return (
    <div className="space-y-4">
      {/* Timer Bar */}
      <div
        className={`rounded-2xl p-4 mb-6 flex items-center justify-between border ${
          isExpired
            ? 'bg-red-50 border-red-200 text-red-700'
            : minutes < 1
            ? 'bg-amber-50 border-amber-200 text-amber-800 animate-pulse'
            : 'bg-blue-50 border-blue-100 text-[#0064D2]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-bold">
            {isExpired ? 'Waktu Reservasi Habis' : 'Sisa Waktu Pembayaran'}
          </span>
        </div>
        <div className="font-mono font-black text-xl tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      {isExpired ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 mb-6 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Waktu hold 5 menit telah habis. Kursi Anda telah dirilis kembali.</span>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 mb-6 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Kursi Anda aman! Tiket di-hold selama 5 menit untuk proses bayar.</span>
        </div>
      )}

      {/* Summary Box */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm border border-gray-100">
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Event</span>
          <span className="font-bold text-gray-900 text-right">{eventName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Jumlah tiket</span>
          <span className="font-bold text-gray-900 flex items-center gap-1">
            <Ticket className="w-4 h-4 text-[#0064D2]" />
            <span>{ticketCount} tiket</span>
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-dashed border-gray-200">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Voucher ({promoCode})
            </span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200/60">
          <span className="font-bold text-gray-900">Total Pembayaran</span>
          <span className="font-black text-[#0064D2] text-lg">{formatCurrency(finalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
