import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder, getStoredOrders } from '../../infrastructure/ordersApi';
import { TicketQRModal } from '../../../buyer/presentation/components/TicketQRModal';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  // Extract order ID from various possible query param names from Xendit or app
  const queryOrderId =
    searchParams.get('order_id') ||
    searchParams.get('orderId') ||
    searchParams.get('external_id') ||
    searchParams.get('id') ||
    '';

  const storedOrders = getStoredOrders();
  const targetOrderId = queryOrderId || storedOrders[0]?.orderId || '';
  const matchingStored = storedOrders.find((o) => o.orderId === targetOrderId) || storedOrders[0];

  const {
    data: order,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['order-callback', targetOrderId],
    queryFn: () => getOrder(targetOrderId),
    enabled: !!targetOrderId,
    refetchInterval: (query) => {
      // Auto-poll if status is still pending payment confirmation
      const st = query.state.data?.status;
      return st === 'PENDING' || st === 'PAYMENT_PENDING' ? 2500 : false;
    },
  });

  const status = order?.status ?? 'PENDING';
  const isPaid = status === 'PAID';
  const isPending = status === 'PENDING' || status === 'PAYMENT_PENDING';
  const isCancelled = status === 'CANCELLED';
  const isRefund = status === 'REFUND_REQUESTED' || status === 'REFUNDED';

  useEffect(() => {
    // If successfully paid, trigger a small celebratory refetch or sync
    if (isPaid) {
      // no-op for now
    }
  }, [isPaid]);

  if (!targetOrderId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0064D2] font-black text-2xl rounded-2xl flex items-center justify-center mx-auto mb-4">
            !
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Informasi Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tidak dapat menemukan ID pesanan. Silakan periksa daftar tiket di akunmu.
          </p>
          <Link
            to="/my-tickets"
            className="w-full inline-block bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md"
          >
            Buka Tiket Saya
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Status Indicator Banner */}
        {isLoading ? (
          <div className="py-12">
            <div className="w-12 h-12 border-4 border-[#0064D2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-900 mb-1">Memeriksa Status Pembayaran...</h2>
            <p className="text-gray-500 text-sm">Menghubungkan ke sistem Xendit dan backend.</p>
          </div>
        ) : isPaid ? (
          <>
            {/* SUCCESS STATE */}
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl font-black shadow-inner">
              ✓
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider mb-2">
              Pembayaran Berhasil
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">
              Hore! Tiketmu Siap Dipakai 🎉
            </h1>

            <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">
              Pembayaran telah terverifikasi lunas. E-ticket dengan QR Pas Masuk sudah aktif dan siap digunakan di gate event.
            </p>

            {/* Order Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-2.5 border border-gray-100 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Event:</span>
                <span className="font-bold text-gray-900 text-right truncate max-w-[220px]">
                  {matchingStored?.eventName || order?.event_id || 'Konser Event'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">ID Pesanan:</span>
                <span className="font-mono text-xs text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 truncate max-w-[180px]">
                  {targetOrderId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Jumlah Tiket:</span>
                <span className="font-bold text-gray-900">
                  {matchingStored?.unitIds?.length || 1} tiket
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total Dibayar:</span>
                <span className="font-black text-[#0064D2] text-lg">
                  {formatCurrency(order?.total_amount || matchingStored?.totalAmount || 0)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowQR(true)}
                className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3.5 rounded-xl font-black text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer hover:scale-[1.01]"
              >
                Lihat E-Ticket & QR Pas Masuk
              </button>

              <button
                onClick={() => navigate('/my-tickets')}
                className="w-full bg-blue-50 hover:bg-blue-100 text-[#0064D2] py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Ke Halaman Tiket Saya
              </button>

              <Link
                to="/events"
                className="block text-gray-500 hover:text-gray-800 text-xs font-semibold pt-1 transition-colors"
              >
                Cari Event Lainnya →
              </Link>
            </div>
          </>
        ) : isPending ? (
          <>
            {/* PENDING STATE */}
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wider mb-2">
              Menunggu Verifikasi
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
              Sedang Memproses Pembayaran
            </h2>

            <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">
              Jika kamu sudah menyelesaikan pembayaran di Xendit, sistem kami akan memperbarui status secara otomatis dalam beberapa detik.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer disabled:opacity-50"
              >
                {isFetching ? 'Memeriksa...' : 'Cek Status Sekarang'}
              </button>

              <button
                onClick={() => navigate('/my-tickets')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Lihat di Tiket Saya
              </button>
            </div>
          </>
        ) : isRefund ? (
          <>
            {/* REFUND STATE */}
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ↺
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Status Refund</h2>
            <p className="text-gray-600 text-sm mb-6">
              Pesanan ini dalam status pengajuan refund / telah direfund oleh penyelenggara.
            </p>
            <button
              onClick={() => navigate('/my-tickets')}
              className="w-full bg-[#0064D2] text-white py-3 rounded-xl font-bold text-sm"
            >
              Kembali ke Tiket Saya
            </button>
          </>
        ) : isCancelled ? (
          <>
            {/* CANCELLED STATE */}
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✕
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wider mb-2">
              Pesanan Dibatalkan
            </span>
            <h2 className="text-xl font-black text-gray-900 mb-2">Pembayaran Dibatalkan / Kadaluarsa</h2>
            <p className="text-gray-600 text-sm mb-6">
              Batas waktu pembayaran telah habis atau pesanan dibatalkan. Kuota tiket telah dikembalikan ke sistem.
            </p>
            <button
              onClick={() => navigate('/events')}
              className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
            >
              Pesan Ulang di Semua Event
            </button>
          </>
        ) : (
          <>
            {/* UNKNOWN / OTHER STATE */}
            <div className="w-16 h-16 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ?
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Status Pesanan: {status}</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan cek kembali status tiket di akunmu.
            </p>
            <button
              onClick={() => navigate('/my-tickets')}
              className="w-full bg-[#0064D2] text-white py-3 rounded-xl font-bold text-sm shadow-md"
            >
              Ke Tiket Saya
            </button>
          </>
        )}
      </div>

      {/* QR Code Modal for Instant Check-in */}
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
