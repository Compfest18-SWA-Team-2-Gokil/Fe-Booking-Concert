import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminApi,
  type OverrideOrderPayload,
  type ReassignTicketPayload,
} from '../infrastructure/adminApi';
import { showAlert, showToast } from '../../../shared/utils/alert';

export function useAdminDisputes() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const disputesQuery = useQuery({
    queryKey: ['admin-disputes', page, limit],
    queryFn: () => adminApi.getDisputes(page, limit),
    refetchInterval: 10_000,
    placeholderData: (prev) => prev,
  });

  const overrideMutation = useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: OverrideOrderPayload }) =>
      adminApi.overrideOrderStatus(orderId, payload),
    onSuccess: (res) => {
      showToast.success(`Status berhasil di-override: ${res.status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
    onError: (err: unknown) => {
      const errorData = err as { response?: { data?: { error?: string } } };
      showAlert.error(
        'Gagal Override Status',
        errorData?.response?.data?.error ?? 'Terjadi kesalahan'
      );
    },
  });

  const reassignMutation = useMutation({
    mutationFn: ({ unitId, payload }: { unitId: string; payload: ReassignTicketPayload }) =>
      adminApi.reassignTicket(unitId, payload),
    onSuccess: () => {
      showToast.success('Unit tiket berhasil dipindahkan');
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
    onError: (err: unknown) => {
      const errorData = err as { response?: { data?: { error?: string } } };
      showAlert.error(
        'Gagal Reassign Tiket',
        errorData?.response?.data?.error ?? 'Terjadi kesalahan'
      );
    },
  });

  return {
    page,
    setPage,
    pagination: disputesQuery.data?.pagination,
    disputes: disputesQuery.data?.disputes ?? [],
    total: disputesQuery.data?.total ?? 0,
    isLoading: disputesQuery.isLoading,
    overrideStatus: overrideMutation.mutateAsync,
    isOverriding: overrideMutation.isPending,
    reassignTicket: reassignMutation.mutateAsync,
    isReassigning: reassignMutation.isPending,
  };
}
