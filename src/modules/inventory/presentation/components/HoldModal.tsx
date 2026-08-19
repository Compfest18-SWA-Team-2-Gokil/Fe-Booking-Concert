import { Loader2 } from 'lucide-react';
import type { HoldResponse } from '../../domain/Ticket';
import { useHoldCountdown } from '../../application/useHoldCountdown';
import { HoldModalSummaryCard } from './hold/HoldModalSummaryCard';

interface HoldModalProps {
  holdData: HoldResponse;
  totalAmount: number;
  eventId: string;
  eventName: string;
  onClose: () => void;
  queueToken?: string | null;
  promoCode?: string;
  discountAmount?: number;
}

export function HoldModal({
  holdData,
  totalAmount,
  eventId,
  eventName,
  onClose,
  queueToken,
  promoCode,
  discountAmount = 0,
}: HoldModalProps) {
  const {
    minutes,
    seconds,
    isExpired,
    paymentStep,
    errorMsg,
    setPaymentStep,
    handlePay,
  } = useHoldCountdown({
    holdData,
    totalAmount,
    eventId,
    eventName,
    queueToken,
    promoCode,
    discountAmount,
  });

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  if (paymentStep === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-100 text-center">
          <Loader2 className="w-12 h-12 text-[#0064D2] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2">Membuat Pesanan...</h2>
          <p className="text-gray-500 text-sm">Jangan tutup halaman ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Konfirmasi Pesanan</h2>
        <p className="text-xs text-gray-500 mb-6">Periksa rincian sebelum beralih ke pembayaran.</p>

        {paymentStep === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 mb-6">
            <p className="font-bold mb-1">Gagal Memproses Pembayaran</p>
            <p>{errorMsg || 'Terjadi kesalahan sistem.'}</p>
            <button
              onClick={() => setPaymentStep('hold')}
              className="mt-2 text-[#0064D2] font-bold underline cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        <HoldModalSummaryCard
          eventName={eventName}
          ticketCount={holdData.unit_ids.length}
          promoCode={promoCode}
          discountAmount={discountAmount}
          totalAmount={totalAmount}
          finalAmount={finalAmount}
          minutes={minutes}
          seconds={seconds}
          isExpired={isExpired}
        />

        <div className="space-y-2 mt-6">
          {!isExpired && (
            <button
              onClick={handlePay}
              className="w-full bg-[#FF6100] hover:bg-[#E55500] text-white py-3.5 rounded-xl font-extrabold shadow-md shadow-orange-500/20 transition-colors text-base cursor-pointer"
            >
              Bayar Sekarang
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm cursor-pointer"
          >
            {isExpired ? 'Coba Lagi' : 'Batal'}
          </button>
        </div>
      </div>
    </div>
  );
}
