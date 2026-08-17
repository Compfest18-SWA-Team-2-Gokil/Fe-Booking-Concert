import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, Loader2 } from 'lucide-react';
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

  // State 2: Kosong setelah fetch selesai
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
        <div className="mb-8">
          {HeaderSection}
          <TicketStatsHeader
            totalOrders={pagination?.total_items ?? tickets.length}
            activeCount={activeCount}
            pendingCount={pendingCount}
          />
        </div>

        <div className="space-y-4">
          {tickets.map((t) => (
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
