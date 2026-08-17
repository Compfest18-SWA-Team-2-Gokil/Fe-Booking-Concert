import { AlertCircle } from 'lucide-react';
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
    filteredRefunds,
  } = useOrganizerRefunds();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0064D2] via-blue-600 to-indigo-700 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pusat Pengajuan Refund
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">Persetujuan Refund</h1>
          <p className="text-blue-100 text-sm mt-1">
            Verifikasi dan setujui pengajuan refund tiket dari pembeli event Anda.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">
        <OrganizerRefundsFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          pendingCount={pendingCount}
        />

        {/* Info Box */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-3xl p-5 flex items-start gap-3.5 text-xs text-blue-900">
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
