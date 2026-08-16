import { useState } from 'react';
import { ShieldCheck, Layers, AlertOctagon, FileText } from 'lucide-react';
import { useAdminMetrics } from '../../application/useAdminMetrics';
import { useAdminDisputes } from '../../application/useAdminDisputes';
import { useAdminAuditLogs } from '../../application/useAdminAuditLogs';
import { AdminMetricsTab } from '../components/AdminMetricsTab';
import { AdminDisputesTab } from '../components/AdminDisputesTab';
import { AdminAuditLogsTab } from '../components/AdminAuditLogsTab';
import { OverrideStatusModal } from '../components/OverrideStatusModal';
import { ReassignTicketModal } from '../components/ReassignTicketModal';
import type { DisputeOrder, OverrideOrderPayload } from '../../infrastructure/adminApi';

type AdminTab = 'metrics' | 'disputes' | 'audit_logs';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('metrics');
  const [selectedDispute, setSelectedDispute] = useState<DisputeOrder | null>(null);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  // Application Hooks
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
    total: disputesTotal,
    isLoading: disputesLoading,
    overrideStatus,
    isOverriding,
    reassignTicket,
    isReassigning,
  } = useAdminDisputes();

  const {
    auditLogs,
    total: auditLogsTotal,
    isLoading: auditLogsLoading,
  } = useAdminAuditLogs();

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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0064D2]">
                <ShieldCheck className="w-3.5 h-3.5" /> Platform Administrator Hub
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Pusat Kontrol & Audit Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring penjualan, audit trail transaksi, serta resolusi sengketa order.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'metrics'
                  ? 'bg-[#0064D2] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Metrik & Event</span>
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activeTab === 'disputes'
                  ? 'bg-[#0064D2] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Sengketa & Refund</span>
              {disputesTotal > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                  {disputesTotal}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit_logs'
                  ? 'bg-[#0064D2] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Audit Logs</span>
              {auditLogsTotal > 0 && (
                <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                  {auditLogsTotal}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Panels */}
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

        {activeTab === 'disputes' && (
          <AdminDisputesTab
            disputes={disputes}
            isLoading={disputesLoading}
            onOpenOverride={(order) => setSelectedDispute(order)}
            onOpenReassign={() => setReassignModalOpen(true)}
          />
        )}

        {activeTab === 'audit_logs' && (
          <AdminAuditLogsTab
            auditLogs={auditLogs}
            total={auditLogsTotal}
            isLoading={auditLogsLoading}
          />
        )}
      </div>

      {/* Modals */}
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
          onSubmit={(unitId, payload) => handleReassignSubmit(unitId, payload)}
        />
      )}
    </div>
  );
}
