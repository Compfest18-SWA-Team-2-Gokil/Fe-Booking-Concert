import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approveRefund } from '../../orders/infrastructure/ordersApi';
import axiosInstance from '../../../core/api/axiosInstance';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { showAlert, showToast } from '../../../shared/utils/alert';

export interface RefundRequestItem {
  order_id: string;
  buyer_id: string;
  buyer_email: string;
  event_id: string;
  event_name: string;
  status: 'REFUND_REQUESTED' | 'REFUND_ORGANIZER_APPROVED' | 'REFUNDED';
  total_amount: number;
  created_at: string;
}

export function useOrganizerRefunds() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ refunds: RefundRequestItem[] }>({
    queryKey: ['organizer-refunds'],
    queryFn: () =>
      axiosInstance.get<{ refunds: RefundRequestItem[] }>('/api/v1/orders/organizer/refunds').then((r: any) => r.data),
    refetchInterval: 8_000,
  });

  const approve = useMutation({
    mutationFn: (id: string) => approveRefund(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['organizer-refunds'] });
      showAlert.success(
        'Refund Berhasil Disetujui',
        `Permintaan refund untuk order #${id.slice(0, 8)} telah disetujui dan diteruskan ke Admin.`
      );
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error ?? 'Gagal menyetujui refund.';
      showAlert.error('Gagal Menyetujui Refund', msg);
    },
  });

  async function handleApprove(orderId: string, eventName: string, amount: number) {
    const isConfirmed = await showAlert.confirm({
      title: 'Setujui Pengajuan Refund?',
      text: `Anda akan menyetujui pengembalian dana ${formatCurrency(amount)} untuk event "${eventName}". Lanjutkan?`,
      confirmText: 'Ya, Setujui',
      cancelText: 'Batal',
      icon: 'question',
    });

    if (isConfirmed) {
      approve.mutate(orderId);
    }
  }

  function handleCopy(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast.success('Order ID berhasil disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  }

  const refunds = data?.refunds ?? [];
  const pendingCount = refunds.filter((r) => r.status === 'REFUND_REQUESTED').length;

  const filteredRefunds = useMemo(() => {
    return refunds.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        r.order_id.toLowerCase().includes(q) ||
        r.buyer_email.toLowerCase().includes(q) ||
        r.event_name.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [refunds, search, statusFilter]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    copiedId,
    handleCopy,
    handleApprove,
    isApproving: approve.isPending,
    isLoading,
    pendingCount,
    filteredRefunds,
  };
}
