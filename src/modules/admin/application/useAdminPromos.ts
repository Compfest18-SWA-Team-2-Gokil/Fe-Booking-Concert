import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promosApi, type CreatePromoPayload, type UpdatePromoPayload } from '../infrastructure/promosApi';
import { showAlert } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export function useAdminPromos() {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['admin-promos'],
    queryFn: () => promosApi.getAdminPromos(),
  });

  const promos = Array.isArray(data) ? data : [];

  const createMutation = useMutation({
    mutationFn: (payload: CreatePromoPayload) => promosApi.createAdminPromo(payload),
    onSuccess: () => {
      showAlert.success('Berhasil!', 'Voucher promo baru berhasil dibuat.');
      queryClient.invalidateQueries({ queryKey: ['admin-promos'] });
      queryClient.invalidateQueries({ queryKey: ['active-promos'] });
    },
    onError: (err) => {
      showAlert.error('Gagal Membuat Promo', getApiErrorMessage(err, 'Terjadi kesalahan saat membuat voucher promo.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePromoPayload }) =>
      promosApi.updateAdminPromo(id, payload),
    onSuccess: () => {
      showAlert.success('Berhasil!', 'Voucher promo berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: ['admin-promos'] });
      queryClient.invalidateQueries({ queryKey: ['active-promos'] });
    },
    onError: (err) => {
      showAlert.error('Gagal Mengupdate Promo', getApiErrorMessage(err, 'Terjadi kesalahan saat memperbarui voucher promo.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promosApi.deleteAdminPromo(id),
    onSuccess: () => {
      showAlert.success('Terhapus!', 'Voucher promo telah berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['admin-promos'] });
      queryClient.invalidateQueries({ queryKey: ['active-promos'] });
    },
    onError: (err) => {
      showAlert.error('Gagal Menghapus Promo', getApiErrorMessage(err, 'Terjadi kesalahan saat menghapus voucher promo.'));
    },
  });

  return {
    promos,
    isLoading,
    error,
    createPromo: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePromo: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deletePromo: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useActivePromos() {
  const query = useQuery({
    queryKey: ['active-promos'],
    queryFn: () => promosApi.getActivePromos(),
  });

  return {
    ...query,
    data: Array.isArray(query.data) ? query.data : [],
  };
}
