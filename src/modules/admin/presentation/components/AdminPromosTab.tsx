import { useState } from 'react';
import type { Promo, CreatePromoPayload, UpdatePromoPayload, PromoType } from '../../infrastructure/promosApi';
import { showAlert } from '../../../../shared/utils/alert';
import { AdminPromosHeader } from './promos/AdminPromosHeader';
import { AdminPromosTable } from './promos/AdminPromosTable';
import { AdminPromoFormModal } from './promos/AdminPromoFormModal';

interface AdminPromosTabProps {
  promos: Promo[];
  events: Array<{ id: string; name: string }>;
  isLoading: boolean;
  onCreatePromo: (payload: CreatePromoPayload) => Promise<any>;
  onUpdatePromo: (params: { id: string; payload: UpdatePromoPayload }) => Promise<any>;
  onDeletePromo: (id: string) => Promise<any>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function AdminPromosTab({
  promos,
  events,
  isLoading,
  onCreatePromo,
  onUpdatePromo,
  onDeletePromo,
  isCreating,
  isUpdating,
}: AdminPromosTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<PromoType>('VOUCHER');
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'VOUCHER' | 'PROMO'>('ALL');

  function openCreateVoucher() {
    setEditingPromo(null);
    setFormType('VOUCHER');
    setModalOpen(true);
  }

  function openCreatePromo() {
    setEditingPromo(null);
    setFormType('PROMO');
    setModalOpen(true);
  }

  function openEdit(promo: Promo) {
    setEditingPromo(promo);
    setFormType(promo.type || (promo.event_id ? 'PROMO' : 'VOUCHER'));
    setModalOpen(true);
  }

  async function handleFormSubmit(payload: CreatePromoPayload) {
    if (editingPromo) {
      await onUpdatePromo({ id: editingPromo.id, payload });
    } else {
      await onCreatePromo(payload);
    }
    setModalOpen(false);
  }

  async function handleDelete(promo: Promo) {
    const isConfirmed = await showAlert.confirm({
      title: 'Hapus Item Promosi?',
      text: `Apakah kamu yakin ingin menghapus ${promo.type === 'PROMO' ? 'Promo Event' : 'Voucher'} "${promo.code}" (${promo.title})?`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      icon: 'warning',
    });

    if (isConfirmed) {
      await onDeletePromo(promo.id);
    }
  }

  const filteredPromos = promos.filter((p) => {
    if (filterType === 'ALL') return true;
    const actualType = p.type || (p.event_id ? 'PROMO' : 'VOUCHER');
    return actualType === filterType;
  });

  return (
    <div className="space-y-6">
      <AdminPromosHeader
        promos={promos}
        filterType={filterType}
        onFilterChange={setFilterType}
        onOpenCreateVoucher={openCreateVoucher}
        onOpenCreatePromo={openCreatePromo}
      />

      <AdminPromosTable
        promos={filteredPromos}
        isLoading={isLoading}
        filterType={filterType}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <AdminPromoFormModal
        isOpen={modalOpen}
        formType={formType}
        editingPromo={editingPromo}
        events={events}
        isSubmitting={isCreating || isUpdating}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
