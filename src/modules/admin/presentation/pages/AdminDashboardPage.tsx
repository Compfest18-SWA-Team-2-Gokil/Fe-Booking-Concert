import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminMetrics } from '../../application/useAdminMetrics';
import { useAdminDisputes } from '../../application/useAdminDisputes';
import { useAdminAuditLogs } from '../../application/useAdminAuditLogs';
import { useAdminPromos } from '../../application/useAdminPromos';
import { AdminHeader, type AdminTab } from '../components/AdminHeader';
import { AdminMetricsTab } from '../components/AdminMetricsTab';
import { AdminDisputesTab } from '../components/AdminDisputesTab';
import { AdminAuditLogsTab } from '../components/AdminAuditLogsTab';
import { AdminPromosTab } from '../components/AdminPromosTab';
import { OverrideStatusModal } from '../components/OverrideStatusModal';
import { ReassignTicketModal } from '../components/ReassignTicketModal';
import type { DisputeOrder, OverrideOrderPayload } from '../../infrastructure/adminApi';

export function AdminDashboardPage() {
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as AdminTab) || 'metrics';

  const [selectedDispute, setSelectedDispute] = useState<DisputeOrder | null>(null);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const {
    events,
    eventsLoading,
    metricQueries,
    platformStats,
    search,
    setSearch,
    filteredEvents,
  } = useAdminMetrics();

  const {
    disputes,
    pagination: disputesPagination,
    setPage: setDisputesPage,
    isLoading: disputesLoading,
    overrideStatus,
    isOverriding,
    reassignTicket,
    isReassigning,
  } = useAdminDisputes();

  const {
    auditLogs,
    pagination: auditLogsPagination,
    setPage: setAuditLogsPage,
    isLoading: auditLogsLoading,
  } = useAdminAuditLogs();

  const {
    promos,
    isLoading: promosLoading,
    createPromo,
    isCreating: isCreatingPromo,
    updatePromo,
    isUpdating: isUpdatingPromo,
    deletePromo,
    isDeleting: isDeletingPromo,
  } = useAdminPromos();

  async function handleOverrideSubmit(payload: OverrideOrderPayload) {
    if (!selectedDispute) return;
    const orderId = selectedDispute.order_id || selectedDispute.id || '';
    await overrideStatus({ orderId, payload });
    setSelectedDispute(null);
  }

  async function handleReassignSubmit(unitId: string, payload: Parameters<typeof reassignTicket>[0]['payload']) {
    await reassignTicket({ unitId, payload });
    setReassignModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminHeader activeTab={activeTab} />

        {activeTab === 'metrics' && (
          <AdminMetricsTab
            events={events}
            platformStats={platformStats}
            filteredEvents={filteredEvents}
            metricQueries={metricQueries}
            eventsLoading={eventsLoading}
            search={search}
            onSearchChange={setSearch}
          />
        )}

        {activeTab === 'promos' && (
          <AdminPromosTab
            promos={promos}
            events={events || []}
            isLoading={promosLoading}
            onCreatePromo={createPromo}
            onUpdatePromo={updatePromo}
            onDeletePromo={deletePromo}
            isCreating={isCreatingPromo}
            isUpdating={isUpdatingPromo}
            isDeleting={isDeletingPromo}
          />
        )}

        {activeTab === 'disputes' && (
          <AdminDisputesTab
            disputes={disputes}
            pagination={disputesPagination}
            onPageChange={setDisputesPage}
            isLoading={disputesLoading}
            onOpenOverride={(order) => setSelectedDispute(order)}
            onOpenReassign={() => setReassignModalOpen(true)}
          />
        )}

        {activeTab === 'audit_logs' && (
          <AdminAuditLogsTab
            auditLogs={auditLogs}
            pagination={auditLogsPagination}
            onPageChange={setAuditLogsPage}
            isLoading={auditLogsLoading}
          />
        )}
      </div>

      {selectedDispute && (
        <OverrideStatusModal
          orderId={selectedDispute.order_id || selectedDispute.id || ''}
          initialStatus={
            selectedDispute.status === 'REFUND_REQUESTED' ||
            selectedDispute.status === 'REFUND_ORGANIZER_APPROVED'
              ? 'REFUNDED'
              : 'PAID'
          }
          isSubmitting={isOverriding}
          onClose={() => setSelectedDispute(null)}
          onSubmit={handleOverrideSubmit}
        />
      )}

      {reassignModalOpen && (
        <ReassignTicketModal
          isSubmitting={isReassigning}
          onClose={() => setReassignModalOpen(false)}
          onSubmit={handleReassignSubmit}
        />
      )}
    </div>
  );
}
