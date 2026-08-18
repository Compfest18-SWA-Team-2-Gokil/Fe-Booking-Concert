import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, Loader2, Search, X } from 'lucide-react';
import { useAuth } from '../../../auth/application/useAuth';
import { useMyTickets } from '../../application/useMyTickets';
import { TicketStatsHeader } from '../components/TicketStatsHeader';
import { TicketCard } from '../components/TicketCard';
import { TicketQRModal } from '../components/TicketQRModal';
import { Pagination } from '../../../../shared/components/ui/Pagination';

export function MyTicketsPage() {
  const { user } = useAuth();
  const {
    tickets,
    filteredTickets,
    totalMatchingCount,
    search,
    setSearch,
    pagination,
    setPage,
    activeCount,
    pendingCount,
    refundingId,
    refundedIds,
    payingId,
    qrModalOrder,
    isLoading,
    isRefunding,
    setQrModalOrder,
    handleRefundClick,
    handlePayClick,
  } = useMyTickets();

  const HeaderSection = (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-[#0064D2] flex items-center justify-center shadow-md shadow-blue-200">
        <Ticket className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tiket Saya</h1>
        <p className="text-sm text-gray-500">Halo, {user?.name}</p>
      </div>
    </div>
  );

  // State 1: Loading dari server
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {HeaderSection}
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Loader2 className="w-10 h-10 text-[#0064D2] mx-auto mb-4 animate-spin" />
            <p className="text-gray-500 text-sm">Memuat tiket kamu...</p>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Kosong setelah fetch selesai (belum pernah beli tiket)
  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {HeaderSection}
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Tiket</h2>
            <p className="text-gray-500 text-sm mb-6">
              Tiketmu akan muncul di sini setelah pembayaran berhasil dikonfirmasi.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-[#0064D2] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#0052B0] transition-colors text-sm"
            >
              Cari Event <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Ada tiket
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          {HeaderSection}
          <TicketStatsHeader
            totalOrders={tickets.length}
            activeCount={activeCount}
            pendingCount={pendingCount}
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 mb-6 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama event atau Order ID..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {search && (
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap hidden sm:inline">
              Ditemukan: <strong className="text-[#0064D2]">{totalMatchingCount}</strong>
            </span>
          )}
        </div>

        {/* Ticket List / Empty Search */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base mb-1">Tiket Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              Tidak ada tiket yang cocok dengan kata kunci &quot;{search}&quot;.
            </p>
            <button
              onClick={() => setSearch('')}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((t) => (
              <TicketCard
                key={t.stored.orderId}
                ticket={t}
                isRefunded={refundedIds.has(t.stored.orderId)}
                isRefunding={isRefunding && refundingId === t.stored.orderId}
                isPaying={payingId === t.stored.orderId}
                onViewQR={setQrModalOrder}
                onPay={handlePayClick}
                onRefund={handleRefundClick}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-6 border-t border-gray-200/60 pt-4"
        />

        <div className="mt-8 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-[#0064D2] font-semibold text-sm hover:underline"
          >
            Cari event lainnya <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {qrModalOrder && (
        <TicketQRModal
          orderId={qrModalOrder.orderId}
          eventId={qrModalOrder.eventId}
          eventName={qrModalOrder.eventName}
          unitIds={qrModalOrder.unitIds}
          onClose={() => setQrModalOrder(null)}
        />
      )}
    </div>
  );
}
