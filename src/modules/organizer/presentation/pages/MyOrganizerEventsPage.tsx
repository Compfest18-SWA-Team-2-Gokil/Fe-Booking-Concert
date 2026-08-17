import { useNavigate } from 'react-router-dom';
import { Plus, Search, Music } from 'lucide-react';
import { useOrganizerEvents } from '../../application/useOrganizerEvents';
import { OrganizerEventCard } from '../components/OrganizerEventCard';
import { OrganizerEventMetricsModal } from '../components/OrganizerEventMetricsModal';
import type { Event } from '../../../events/domain/models/Event';

export function MyOrganizerEventsPage() {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    metricEventId,
    setMetricEventId,
    myEvents,
    filteredEvents,
    isLoading,
    handleDelete,
    isDeleting,
  } = useOrganizerEvents();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0064D2] via-blue-600 to-indigo-700 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Organizer Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">Event Saya</h1>
            <p className="text-blue-100 text-sm mt-1">Kelola semua event yang kamu selenggarakan.</p>
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

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
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
              {search ? `Tidak ditemukan event dengan kata kunci "${search}".` : 'Buat event sekarang dan mulai penjualan tiket.'}
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
            {filteredEvents.map((event: Event) => (
              <OrganizerEventCard
                key={event.id}
                event={event}
                onOpenMetrics={(id) => setMetricEventId(id)}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>

      {metricEventId && (
        <OrganizerEventMetricsModal eventId={metricEventId} onClose={() => setMetricEventId(null)} />
      )}
    </div>
  );
}
