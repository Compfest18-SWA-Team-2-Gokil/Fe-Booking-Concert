import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar, MapPin, Plus, Ticket, Users, BarChart3,
  Search, ArrowRight, Music, Clock
} from 'lucide-react';
import { useEvents } from '../../../events/application/useEvents';
import { useAuth } from '../../../auth/application/useAuth';
import axiosInstance from '../../../../core/api/axiosInstance';
import { formatDate } from '../../../../core/utils/formatDate';

interface TicketTypeMetrics {
  ticket_type_id: string;
  available: number;
  held: number;
  sold: number;
  admitted: number;
  refunded: number;
  total: number;
}

function EventMetricsModal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const { data, isLoading } = useQuery<{ event_id: string; metrics: TicketTypeMetrics[] }>({
    queryKey: ['metrics', eventId],
    queryFn: () =>
      axiosInstance.get(`/api/v1/events/${eventId}/metrics`).then((r) => r.data),
    refetchInterval: 5_000,
  });

  const totals = data?.metrics.reduce(
    (acc, m) => ({
      available: acc.available + m.available,
      held: acc.held + m.held,
      sold: acc.sold + m.sold,
      admitted: acc.admitted + m.admitted,
      refunded: acc.refunded + m.refunded,
      total: acc.total + m.total,
    }),
    { available: 0, held: 0, sold: 0, admitted: 0, refunded: 0, total: 0 }
  ) ?? { available: 0, held: 0, sold: 0, admitted: 0, refunded: 0, total: 0 };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0064D2] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Metrik Penjualan Tiket</h3>
              <p className="text-xs text-gray-500">Pembaruan real-time setiap 5 detik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 py-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Tersedia</span>
              <p className="text-3xl font-black text-green-700 mt-1">{totals.available}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-[#0064D2] uppercase tracking-wider">Terjual</span>
              <p className="text-3xl font-black text-[#0064D2] mt-1">{totals.sold}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Sedang Di-Hold</span>
              <p className="text-3xl font-black text-amber-700 mt-1">{totals.held}</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Check-in / Admitted</span>
              <p className="text-3xl font-black text-purple-700 mt-1">{totals.admitted}</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

const GRADIENTS = [
  'from-violet-600 via-purple-600 to-indigo-700',
  'from-rose-500 via-pink-600 to-purple-600',
  'from-amber-500 via-orange-600 to-red-600',
  'from-emerald-500 via-[#0064D2] to-blue-700',
  'from-cyan-500 via-blue-600 to-[#0064D2]',
  'from-fuchsia-600 via-pink-500 to-rose-600',
];

function gradientFor(id: string): string {
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export function MyOrganizerEventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: events, isLoading } = useEvents();
  const [search, setSearch] = useState('');
  const [metricEventId, setMetricEventId] = useState<string | null>(null);

  const myEvents = events?.filter((e) => e.organizer_id === user?.id) ?? [];
  const filteredEvents = myEvents.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0064D2] via-blue-600 to-indigo-700 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Organizer Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Event Saya</h1>
            <p className="text-blue-100 text-sm mt-1">
              Kelola semua daftar konser dan pertunjukan musik yang kamu selenggarakan.
            </p>
          </div>

          <button
            onClick={() => navigate('/organizer/events/create')}
            className="flex items-center gap-2 bg-white text-[#0064D2] font-bold px-5 py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition-all text-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Buat Event Baru
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari event saya..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:bg-white transition-all"
            />
          </div>

          <div className="text-xs font-bold text-gray-500">
            Total Event: <span className="text-[#0064D2]">{myEvents.length}</span>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Music className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {search ? 'Tidak Ada Event yang Cocok' : 'Belum Ada Event'}
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {search
                ? `Tidak ditemukan event dengan kata kunci "${search}".`
                : 'Kamu belum membuat konser atau pertunjukan musik. Buat sekarang dan mulai penjualan tiket.'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/organizer/events/create')}
                className="inline-flex items-center gap-2 bg-[#0064D2] text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-[#0052B0] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Buat Event Sekarang
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col transition-all duration-300"
              >
                {/* Visual Banner */}
                <div className={`relative h-40 bg-gradient-to-br ${gradientFor(event.id)} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-lg pointer-events-none" />
                  <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-black/10 blur-lg pointer-events-none" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
                    <Music className="w-7 h-7" />
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                      Aktif
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 leading-snug mb-3 line-clamp-2">
                      {event.name}
                    </h2>

                    <div className="space-y-2 text-xs text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#0064D2] shrink-0" />
                        <span className="font-medium text-gray-700">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Pukul {new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="truncate text-gray-700">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setMetricEventId(event.id)}
                      className="w-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-[#0064D2] font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Lihat Metrik Penjualan
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/organizer/events/${event.id}/ticket-types`)}
                        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Kelola Tiket
                      </button>
                      <button
                        onClick={() => navigate(`/organizer/events/${event.id}/gate-operators`)}
                        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Gate Operator
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-full flex items-center justify-center text-[11px] font-semibold text-gray-400 hover:text-gray-700 pt-1 transition-colors cursor-pointer"
                    >
                      Lihat Tampilan Publik
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Modal */}
      {metricEventId && (
        <EventMetricsModal
          eventId={metricEventId}
          onClose={() => setMetricEventId(null)}
        />
      )}
    </div>
  );
}
