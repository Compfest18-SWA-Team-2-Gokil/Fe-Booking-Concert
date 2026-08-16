import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyOrders,
  requestRefund,
  initiatePayment,
  getStoredOrders,
  type StoredOrder,
  type Order,
} from '../../orders/infrastructure/ordersApi';
import { useAuth } from '../../auth/application/useAuth';
import { showAlert, showToast } from '../../../shared/utils/alert';

export interface TicketItem {
  stored: StoredOrder;
  order: Order | null;
  isLoading: boolean;
}

export function useMyTickets() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundedIds, setRefundedIds] = useState<Set<string>>(new Set());
  const [payingId, setPayingId] = useState<string | null>(null);
  const [qrModalOrder, setQrModalOrder] = useState<StoredOrder | null>(null);

  // Primary source of truth: fetch langsung semua order dari backend
  const { data: serverResponse, isLoading: serverLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => getMyOrders(),
    enabled: !!token,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });

  const serverOrders = serverResponse?.orders ?? [];

  // Fallback cache di localStorage jika ada
  const localOrders = getStoredOrders();
  const localMap = new Map(localOrders.map((o) => [o.orderId, o]));

  // Buat list TicketItem dari serverOrders
  const tickets: TicketItem[] = serverOrders.map((order) => {
    const local = localMap.get(order.id);
    
    // Gunakan event_name dan unit_ids dari server jika ada, atau fallback ke local
    const eventName = order.event_name || local?.eventName || 'Event Tiket';
    const unitIds = (order.unit_ids && order.unit_ids.length > 0) 
      ? order.unit_ids 
      : (local?.unitIds ?? []);

    const stored: StoredOrder = {
      orderId: order.id,
      eventId: order.event_id,
      eventName,
      unitIds,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
    };

    return {
      stored,
      order,
      isLoading: false,
    };
  });

  const refundMutation = useMutation({
    mutationFn: (orderId: string) => requestRefund(orderId),
    onSuccess: (_, orderId) => {
      setRefundedIds((prev) => new Set([...prev, orderId]));
      setRefundingId(null);
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      showAlert.success(
        'Pengajuan Refund Berhasil',
        'Permintaan refund tiket telah dicatat. Organizer akan memproses pengembalian dana.'
      );
    },
    onError: (error: any) => {
      setRefundingId(null);
      const msg =
        error?.response?.data?.error ??
        'Terjadi kendala saat mengajukan refund. Silakan coba kembali.';
      showAlert.error('Gagal Mengajukan Refund', msg);
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
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ??
        'Tidak dapat membuat invoice pembayaran untuk order ini.';
      showAlert.error('Gagal Membuka Pembayaran', msg);
    } finally {
      setPayingId(null);
    }
  }, []);

  const activeCount = tickets.filter((t) => t.order?.status === 'PAID').length;
  const pendingCount = tickets.filter(
    (t) => t.order?.status === 'PENDING' || t.order?.status === 'PAYMENT_PENDING'
  ).length;

  return {
    storedOrders: localOrders,
    tickets,
    activeCount,
    pendingCount,
    refundingId,
    refundedIds,
    payingId,
    qrModalOrder,
    isLoading: serverLoading,
    isError,
    isRefunding: refundMutation.isPending,
    setQrModalOrder,
    handleRefundClick,
    handlePayClick,
  };
}
