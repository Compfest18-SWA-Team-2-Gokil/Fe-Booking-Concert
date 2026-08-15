import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Ticket, AlertCircle, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import type { HoldResponse } from '../../domain/Ticket';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import { createOrder, initiatePayment, storeOrder } from '../../../../modules/orders/infrastructure/ordersApi';
import { showAlert, showToast } from '../../../../shared/utils/alert';

interface HoldModalProps {
  holdData: HoldResponse;
  totalAmount: number;
  eventId: string;
  eventName: string;
  onClose: () => void;
}

type PaymentStep = 'hold' | 'processing' | 'redirect' | 'error';

export function HoldModal({ holdData, totalAmount, eventId, eventName, onClose }: HoldModalProps) {
  const navigate = useNavigate();
  const heldUntil = new Date(holdData.held_until).getTime();
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((heldUntil - Date.now()) / 1000))
  );
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('hold');
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [createdOrderId, setCreatedOrderId] = useState('');

  useEffect(() => {
    if (paymentStep !== 'hold') return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((heldUntil - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        showAlert.warning(
          'Waktu Reservasi Habis',
          'Sesi reservasi tiketmu telah kedaluwarsa. Silakan lakukan reservasi ulang.'
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [heldUntil, paymentStep]);

  async function handlePay() {
    const confirm = await showAlert.confirm({
      title: 'Lanjutkan ke Pembayaran?',
      text: `Total tagihan: ${formatCurrency(totalAmount)} untuk ${holdData.unit_ids.length} tiket.`,
      confirmText: 'Ya, Bayar Sekarang',
      cancelText: 'Cek Kembali',
      icon: 'question',
    });

    if (!confirm) return;

    setPaymentStep('processing');
    try {
      const order = await createOrder(eventId, holdData.unit_ids);
      setCreatedOrderId(order.id);
      const payment = await initiatePayment(order.id);
      storeOrder({
        orderId: order.id,
        eventId,
        eventName,
        unitIds: holdData.unit_ids,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      });
      setInvoiceUrl(payment.invoice_url);
      window.open(payment.invoice_url, '_blank');
      showToast.success('Halaman pembayaran dibuka di tab baru!');
      setPaymentStep('redirect');
    } catch {
      setErrorMsg('Gagal membuat pesanan tiket. Silakan coba lagi.');
      showAlert.error('Gagal Membuat Pesanan', 'Terjadi kendala saat menghubungi gateway pembayaran.');
      setPaymentStep('error');
    }
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isExpired = secondsLeft === 0 && paymentStep === 'hold';

  if (paymentStep === 'redirect') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-10 h-10 text-[#0064D2]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Halaman Pembayaran Dibuka</h2>
          <p className="text-gray-500 text-sm mb-6">
            Selesaikan pembayaran di tab baru. Setelah selesai membayar, klik tombol di bawah untuk melihat tiketmu.
          </p>
          <div className="space-y-3">
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#FF6100] hover:bg-[#E55500] text-white py-3.5 rounded-xl font-extrabold shadow-md transition-colors text-base flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Buka Halaman Pembayaran
            </a>
            <button
              onClick={() => navigate(`/payment/callback?order_id=${createdOrderId}`)}
              className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3 rounded-xl font-bold transition-colors text-sm shadow-md"
            >
              Saya Sudah Bayar / Cek Status
            </button>
            <button
              onClick={() => navigate('/my-tickets')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
            >
              Ke Tiket Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  if (paymentStep === 'error') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Gagal Membuat Pesanan</h2>
          <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentStep('hold')}
              className="w-full bg-[#0064D2] text-white py-3 rounded-xl font-bold hover:bg-[#0052B0] transition-colors"
            >
              Coba Lagi
            </button>
            <button onClick={onClose} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm">
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          {isExpired ? (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-red-600">Waktu Habis!</h2>
              <p className="text-gray-500 mt-2 text-sm">Reservasi tiketmu sudah kedaluwarsa. Silakan coba lagi.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#0064D2]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Tiket Berhasil Direservasi!</h2>
              <p className="text-gray-500 mt-2 text-sm">Selesaikan pembayaran sebelum waktu habis</p>
            </>
          )}
        </div>

        <div className={`text-center mb-6 p-5 rounded-2xl border ${isExpired ? 'bg-red-50 border-red-100' : 'bg-blue-50/70 border-blue-100'}`}>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            <Clock className="w-4 h-4 text-[#0064D2]" />
            <span>Waktu Tersisa Hold</span>
          </div>
          <div className={`text-4xl font-black font-mono tracking-tight ${isExpired ? 'text-red-600' : 'text-[#0064D2]'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Event</span>
            <span className="font-bold text-gray-900 text-right">{eventName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Jumlah tiket</span>
            <span className="font-bold text-gray-900 flex items-center gap-1">
              <Ticket className="w-4 h-4 text-[#0064D2]" />
              {holdData.unit_ids.length} tiket
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200/60">
            <span className="font-bold text-gray-900">Total Pembayaran</span>
            <span className="font-black text-[#0064D2] text-lg">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="space-y-3">
          {!isExpired && (
            <button
              onClick={handlePay}
              className="w-full bg-[#FF6100] hover:bg-[#E55500] text-white py-3.5 rounded-xl font-extrabold shadow-md shadow-orange-500/20 transition-colors text-base"
            >
              Bayar Sekarang
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
          >
            {isExpired ? 'Coba Lagi' : 'Batal'}
          </button>
        </div>
      </div>
    </div>
  );
}
