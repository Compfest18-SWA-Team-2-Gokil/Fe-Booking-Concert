import { useState, useEffect, useCallback } from 'react';
import type { HoldResponse } from '../domain/Ticket';
import { createOrder, initiatePayment, storeOrder } from '../../orders/infrastructure/ordersApi';
import { showAlert, showToast } from '../../../shared/utils/alert';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export type PaymentStep = 'hold' | 'processing' | 'redirect' | 'error';

interface UseHoldCountdownOptions {
  holdData: HoldResponse;
  totalAmount: number;
  eventId: string;
  eventName: string;
  queueToken?: string | null;
  promoCode?: string;
  discountAmount?: number;
}

export function useHoldCountdown({
  holdData,
  totalAmount,
  eventId,
  eventName,
  queueToken,
  promoCode,
  discountAmount = 0,
}: UseHoldCountdownOptions) {
  const heldUntil = new Date(holdData.held_until).getTime();
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((heldUntil - Date.now()) / 1000))
  );
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('hold');
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const finalPayAmount = Math.max(0, totalAmount - discountAmount);

  const handlePay = useCallback(async () => {
    const confirm = await showAlert.confirm({
      title: 'Lanjutkan ke Pembayaran?',
      text: `Total tagihan: ${formatCurrency(finalPayAmount)} untuk ${holdData.unit_ids.length} tiket.${
        discountAmount > 0 ? ` (Termasuk hemat ${formatCurrency(discountAmount)})` : ''
      }`,
      confirmText: 'Ya, Bayar Sekarang',
      cancelText: 'Cek Kembali',
      icon: 'question',
    });

    if (!confirm) return;

    setPaymentStep('processing');
    try {
      const order = await createOrder(eventId, holdData.unit_ids, queueToken, promoCode);
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
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Terjadi kendala saat menghubungi gateway pembayaran.');
      setErrorMsg(msg);
      showAlert.error('Gagal Membuat Pesanan', msg);
      setPaymentStep('error');
    }
  }, [eventId, eventName, holdData.unit_ids, finalPayAmount, discountAmount, queueToken, promoCode]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isExpired = secondsLeft === 0 && paymentStep === 'hold';

  return {
    secondsLeft,
    minutes,
    seconds,
    isExpired,
    paymentStep,
    invoiceUrl,
    createdOrderId,
    errorMsg,
    setPaymentStep,
    handlePay,
  };
}
