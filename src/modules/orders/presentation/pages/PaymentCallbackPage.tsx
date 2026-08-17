import { usePaymentCallback } from '../../application/usePaymentCallback';
import { PaymentSuccessState } from '../components/PaymentSuccessState';
import { PaymentPendingState } from '../components/PaymentPendingState';
import {
  PaymentNotFoundState,
  PaymentCancelledState,
  PaymentRefundState,
} from '../components/PaymentOtherStates';
import { TicketQRModal } from '../../../buyer/presentation/components/TicketQRModal';

export function PaymentCallbackPage() {
  const {
    targetOrderId,
    matchingStored,
    order,
    status,
    isLoading,
    isPaid,
    isPending,
    isCancelled,
    isRefund,
    isFetching,
    refetch,
    showQR,
    setShowQR,
  } = usePaymentCallback();

  if (!targetOrderId) {
    return <PaymentNotFoundState />;
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {isLoading ? (
          <div className="py-12">
            <div className="w-12 h-12 border-4 border-[#0064D2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-900 mb-1">Memeriksa Status Pembayaran...</h2>
            <p className="text-gray-500 text-sm">Menghubungkan ke sistem Xendit dan backend.</p>
          </div>
        ) : isPaid ? (
          <PaymentSuccessState
            order={order}
            matchingStored={matchingStored}
            targetOrderId={targetOrderId}
            onOpenQR={() => setShowQR(true)}
          />
        ) : isPending ? (
          <PaymentPendingState onRefetch={refetch} isFetching={isFetching} />
        ) : isRefund ? (
          <PaymentRefundState />
        ) : isCancelled ? (
          <PaymentCancelledState />
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Status Pesanan: {status}</h2>
            <p className="text-gray-600 text-sm">Silakan cek kembali status tiket di akunmu.</p>
          </div>
        )}
      </div>

      {showQR && (
        <TicketQRModal
          orderId={targetOrderId}
          eventId={matchingStored?.eventId || order?.event_id || ''}
          eventName={matchingStored?.eventName || 'Konser Event'}
          unitIds={matchingStored?.unitIds || []}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
