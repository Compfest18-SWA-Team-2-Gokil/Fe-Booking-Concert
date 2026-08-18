import { AlertCircle, RotateCcw } from 'lucide-react';
import { useOrganizerRefunds } from '../../application/useOrganizerRefunds';
import { OrganizerRefundsFilterBar } from '../components/OrganizerRefundsFilterBar';
import { OrganizerRefundsTable } from '../components/OrganizerRefundsTable';
import { Pagination } from '../../../../shared/components/ui/Pagination';

export function OrganizerRefundsPage() {
  const {
    pagination,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    copiedId,
    handleCopy,
    handleApprove,
    isApproving,
    isLoading,
    pendingCount,
    waitingAdminCount,
    completedCount,
    filteredRefunds,
  } = useOrganizerRefunds();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0064D2]">
                <RotateCcw className="w-3.5 h-3.5" /> Pusat Pengajuan Refund
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Persetujuan Refund Organizer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Verifikasi dan setujui pengajuan refund tiket dari pembeli event Anda.
            </p>
          </div>
        </div>

        <OrganizerRefundsFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          pendingCount={pendingCount}
          waitingAdminCount={waitingAdminCount}
          completedCount={completedCount}
        />

        {/* Info Box */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-3xl p-5 flex items-start gap-3.5 text-xs text-blue-900 shadow-xs">
          <AlertCircle className="w-5 h-5 text-[#0064D2] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-[#0064D2]">Alur Persetujuan 2 Tahap (Two-Tier Refund Workflow)</p>
            <p className="text-blue-800 leading-relaxed">
              1. <strong>Tahap 1 (Organizer)</strong>: Anda menyetujui validitas alasan pengajuan refund pembeli.<br />
              2. <strong>Tahap 2 (Platform Admin)</strong>: Admin mengeksekusi pencairan saldo/transfer Xendit kembali ke rekening pembeli.
            </p>
          </div>
        </div>

        <OrganizerRefundsTable
          refunds={filteredRefunds}
          isLoading={isLoading}
          search={search}
          statusFilter={statusFilter}
          copiedId={copiedId}
          onCopy={handleCopy}
          onApprove={handleApprove}
          isApproving={isApproving}
        />

        {/* Pagination Controls */}
        <Pagination
          pagination={pagination}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-xs"
        />
      </div>
    </div>
  );
}
