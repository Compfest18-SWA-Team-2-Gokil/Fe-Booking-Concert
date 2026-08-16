import { useState, useCallback } from 'react';
import { useQueries, useMutation } from '@tanstack/react-query';
import {
  getStoredOrders,
  getOrder,
  requestRefund,
  initiatePayment,
  type StoredOrder,
  type Order,
} from '../../orders/infrastructure/ordersApi';
import { showAlert, showToast } from '../../../shared/utils/alert';

export interface TicketItem {
  stored: StoredOrder;
  order: Order | null;
  isLoading: boolean;
}

export function useMyTickets() {
  const storedOrders = getStoredOrders();
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundedIds, setRefundedIds] = useState<Set<string>>(new Set());
  const [payingId, setPayingId] = useState<string | null>(null);
  const [qrModalOrder, setQrModalOrder] = useState<StoredOrder | null>(null);

  const orderQueries = useQueries({
    queries: storedOrders.map((o) => ({
      queryKey: ['order', o.orderId],
      queryFn: () => getOrder(o.orderId),
      retry: false,
    })),
  });

  const refundMutation = useMutation({
    mutationFn: (orderId: string) => requestRefund(orderId),
    onSuccess: (_, orderId) => {
      setRefundedIds((prev) => new Set([...prev, orderId]));
      setRefundingId(null);
      showAlert.success(
        'Pengajuan Refund Berhasil',
        'Permintaan refund tiket telah dicatat. Tim kami akan memproses pengembalian dana.'
      );
    },
    onError: () => {
      setRefundingId(null);
      showAlert.error(
        'Gagal Mengajukan Refund',
        'Terjadi kendala saat mengajukan refund. Silakan coba kembali beberapa saat lagi.'
      );
    },
  });

  const handleRefundClick = useCallback(
    async (orderId: string, eventName: string) => {
      const isConfirmed = await showAlert.confirm({
        title: 'Ajukan Refund Tiket?',
        text: `Apakah kamu yakin ingin mengajukan refund untuk pesanan "${eventName}"?`,
        confirmText: 'Ya, Ajukan Refund',
        cancelText: 'Batalkan',
        icon: 'warning',
        isDanger: true,
      });

      if (isConfirmed) {
        setRefundingId(orderId);
        refundMutation.mutate(orderId);
      }
    },
    [refundMutation]
  );

  const handlePayClick = useCallback(async (orderId: string) => {
    setPayingId(orderId);
    try {
      const res = await initiatePayment(orderId);
      window.open(res.invoice_url, '_blank');
      showToast.success('Halaman pembayaran dibuka di tab baru!');
    } catch {
      showAlert.error(
        'Gagal Membuka Pembayaran',
        'Tidak dapat membuat invoice pembayaran untuk order ini.'
      );
    } finally {
      setPayingId(null);
    }
  }, []);

  const tickets: TicketItem[] = storedOrders.map((stored, i) => ({
    stored,
    order: orderQueries[i]?.data ?? null,
    isLoading: orderQueries[i]?.isLoading ?? false,
  }));

  const activeCount = tickets.filter((t) => t.order?.status === 'PAID').length;
  const pendingCount = tickets.filter(
    (t) => t.order?.status === 'PENDING' || t.order?.status === 'PAYMENT_PENDING'
  ).length;

  return {
    storedOrders,
    tickets,
    activeCount,
    pendingCount,
    refundingId,
    refundedIds,
    payingId,
    qrModalOrder,
    isRefunding: refundMutation.isPending,
    setQrModalOrder,
    handleRefundClick,
    handlePayClick,
  };
}
