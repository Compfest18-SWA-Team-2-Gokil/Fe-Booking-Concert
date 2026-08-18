import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approveRefund, getOrganizerRefunds, type OrganizerRefundItem } from '../../orders/infrastructure/ordersApi';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { showAlert, showToast } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export type { OrganizerRefundItem as RefundRequestItem };

export function useOrganizerRefunds() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['organizer-refunds', page, limit],
    queryFn: () => getOrganizerRefunds(page, limit),
    refetchInterval: 8_000,
    placeholderData: (prev) => prev,
  });

  const approve = useMutation({
    mutationFn: (id: string) => approveRefund(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['organizer-refunds'] });
      showAlert.success(
        'Refund Berhasil Disetujui',
        `Permintaan refund untuk order #${id.slice(0, 8)} telah disetujui dan diteruskan ke Admin untuk pencairan dana.`
      );
    },
    onError: (error: unknown) => {
      showAlert.error('Gagal Menyetujui Refund', getApiErrorMessage(error, 'Gagal menyetujui refund.'));
    },
  });

  async function handleApprove(orderId: string, eventName: string, amount: number) {
    const isConfirmed = await showAlert.confirm({
      title: 'Setujui Pengajuan Refund?',
      text: `Anda akan menyetujui pengembalian dana ${formatCurrency(amount)} untuk event "${eventName}". Pengajuan akan diteruskan ke Admin untuk pencairan dana. Lanjutkan?`,
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
  const pagination = data?.pagination;
  const pendingCount = refunds.filter((r) => r.status === 'REFUND_REQUESTED').length;
  const waitingAdminCount = refunds.filter((r) => r.status === 'REFUND_ORGANIZER_APPROVED').length;
  const completedCount = refunds.filter((r) => r.status === 'REFUNDED').length;

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
    page,
    setPage,
    pagination,
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
    waitingAdminCount,
    completedCount,
    filteredRefunds,
  };
}
