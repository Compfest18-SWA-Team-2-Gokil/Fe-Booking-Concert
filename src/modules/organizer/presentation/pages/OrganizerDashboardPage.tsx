import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, BarChart3, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { useEvents } from '../../../events/application/useEvents';
import { useAuth } from '../../../auth/application/useAuth';
import axiosInstance from '../../../../core/api/axiosInstance';
import { formatDate } from '../../../../core/utils/formatDate';
import { approveRefund } from '../../../../modules/orders/infrastructure/ordersApi';
import { showAlert } from '../../../../shared/utils/alert';

interface TicketTypeMetrics {
  ticket_type_id: string;
  available: number;
  held: number;
  sold: number;
  admitted: number;
  refunded: number;
  total: number;
}

function MetricsCard({ eventId }: { eventId: string }) {
  const { data, isLoading } = useQuery<{ event_id: string; metrics: TicketTypeMetrics[] }>({
    queryKey: ['metrics', eventId],
    queryFn: () =>
      axiosInstance.get(`/api/v1/events/${eventId}/metrics`).then((r) => r.data),
    refetchInterval: 10_000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const totals = data?.metrics.reduce(
    (acc, m) => ({
      available: acc.available + m.available,
      held: acc.held + m.held,
      sold: acc.sold + m.sold,
      admitted: acc.admitted + m.admitted,
    }),
    { available: 0, held: 0, sold: 0, admitted: 0 }
  ) ?? { available: 0, held: 0, sold: 0, admitted: 0 };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
      <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
        <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Available</p>
        <p className="text-2xl font-black text-green-700 mt-0.5">{totals.available}</p>
      </div>
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center">
        <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Held</p>
        <p className="text-2xl font-black text-yellow-700 mt-0.5">{totals.held}</p>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
        <p className="text-xs font-bold text-[#0064D2] uppercase tracking-wider">Terjual</p>
        <p className="text-2xl font-black text-[#0064D2] mt-0.5">{totals.sold}</p>
      </div>
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Admitted</p>
        <p className="text-2xl font-black text-purple-700 mt-0.5">{totals.admitted}</p>
      </div>
    </div>
  );
}

function ApproveRefundCard() {
  const [orderId, setOrderId] = useState('');

  const approve = useMutation({
    mutationFn: (id: string) => approveRefund(id),
    onSuccess: (_, id) => {
      setOrderId('');
      showAlert.success(
        'Refund Disetujui',
        `Permintaan refund untuk order ${id} berhasil disetujui.`
      );
    },
    onError: () => {
      showAlert.error(
        'Gagal Menyetujui Refund',
        'Pastikan Order ID valid dan pesanan memiliki status REFUND_REQUESTED.'
      );
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    approve.mutate(orderId.trim());
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-black text-gray-900 mb-1">Approve Refund</h2>
      <p className="text-xs text-gray-500 mb-4">Setujui permintaan refund dari pembeli berdasarkan Order ID.</p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID (UUID)"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
        />
        <button
          type="submit"
          disabled={approve.isPending || !orderId.trim()}
          className="bg-[#0064D2] text-white font-bold px-4 py-2.5 rounded-xl hover:bg-[#0052B0] disabled:opacity-50 transition-colors text-sm cursor-pointer"
        >
          {approve.isPending ? 'Memproses...' : 'Approve'}
        </button>
      </form>
    </div>
  );
}

export function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: events, isLoading } = useEvents();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const myEvents = events?.filter((e) => e.organizer_id === user?.id) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#0064D2] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-gradient-to-r from-[#0064D2] to-blue-700 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-5 h-5 text-blue-200" />
                <span className="text-blue-200 text-sm font-semibold">Organizer Dashboard</span>
              </div>
              <h1 className="text-3xl font-black">Kelola Event Kamu</h1>
              <p className="text-blue-200 text-sm mt-1">Real-time metrics dari semua event aktifmu</p>
            </div>
            <button
              onClick={() => navigate('/organizer/events/create')}
              className="flex items-center gap-2 bg-white text-[#0064D2] font-bold px-5 py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Buat Event Baru
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <ApproveRefundCard />

        {myEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <TrendingUp className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Event</h2>
            <p className="text-gray-500 text-sm mb-6">Mulai buat event pertamamu dan pantau penjualan tiket secara real-time.</p>
            <button
              onClick={() => navigate('/organizer/events/create')}
              className="bg-[#0064D2] text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-[#0052B0] transition-colors"
            >
              Buat Event Sekarang
            </button>
          </div>
        ) : (
          myEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-black text-gray-900 truncate">{event.name}</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-[#0064D2]" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-[#0064D2]" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                    className="flex items-center text-sm font-bold text-[#0064D2] bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors shrink-0"
                  >
                    {expandedId === event.id ? 'Sembunyikan' : 'Lihat Metrik'}
                  </button>
                </div>

                {expandedId === event.id && <MetricsCard eventId={event.id} />}
              </div>

              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/50 flex gap-3">
                <button
                  onClick={() => navigate(`/organizer/events/${event.id}/ticket-types`)}
                  className="flex items-center text-xs font-bold text-gray-600 hover:text-[#0064D2] transition-colors"
                >
                  Kelola Tiket
                </button>
                <button
                  onClick={() => navigate(`/organizer/events/${event.id}/gate-operators`)}
                  className="flex items-center text-xs font-bold text-gray-600 hover:text-[#0064D2] transition-colors"
                >
                  Assign Gate Operator
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
