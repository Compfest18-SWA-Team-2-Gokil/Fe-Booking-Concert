import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Layers,
  TrendingUp,
  CheckCircle2,
  Zap,
  RotateCcw,
  Plus,
  Search,
  Building2,
  Ticket,
  Users,
  Edit,
  Trash2,
  BarChart2,
} from 'lucide-react';
import { useOrganizerEvents } from '../../application/useOrganizerEvents';
import { OrganizerEventMetricsModal } from '../components/OrganizerEventMetricsModal';
import { formatDate } from '../../../../core/utils/formatDate';
import { TableSkeleton } from '../../../../shared/components/ui/TableSkeleton';

export function MyOrganizerEventsPage() {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    metricEventId,
    setMetricEventId,
    myEvents,
    filteredEvents,
    metricQueries,
    organizerStats,
    isLoading,
    handleDelete,
    isDeleting,
  } = useOrganizerEvents();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0064D2]">
                <Building2 className="w-3.5 h-3.5" /> Organizer Workspace Hub
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Pusat Kontrol & Event Organizer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring penjualan tiket, kuota real-time, serta kelola seluruh event Anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/organizer/events/create')}
              className="flex items-center gap-2 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-5 py-2.5 rounded-2xl shadow-sm text-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Event Baru</span>
            </button>
          </div>
        </div>

        {/* 6 Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Event</span>
              <Calendar className="w-4 h-4 text-[#0064D2]" />
            </div>
            <div className="text-2xl font-black text-gray-900">{myEvents.length}</div>
            <span className="text-[11px] text-gray-400 mt-1">Event aktif terdaftar</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Kuota</span>
              <Layers className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-2xl font-black text-slate-800">
              {organizerStats.totalQuota.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-gray-400 mt-1">Unit tiket diterbitkan</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terjual</span>
              <TrendingUp className="w-4 h-4 text-[#0064D2]" />
            </div>
            <div className="text-2xl font-black text-[#0064D2]">
              {organizerStats.sold.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1">
              {organizerStats.totalQuota > 0
                ? `${Math.round((organizerStats.sold / organizerStats.totalQuota) * 100)}% terjual`
                : '0%'}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admitted</span>
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700">
              {organizerStats.admitted.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-purple-600 font-medium mt-1">Scan gate masuk</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sedang Hold</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">
              {organizerStats.held.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-gray-400 mt-1">Reservasi 5 menit</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Refunded</span>
              <RotateCcw className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-black text-red-600">
              {organizerStats.refunded.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-gray-400 mt-1">Tiket dibatalkan</span>
          </div>
        </div>

        {/* Event List & Metrics Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">Event Saya & Metrik Penjualan</h2>
              <p className="text-xs text-gray-500">Data live kuota dan performa masing-masing event Anda</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari event / lokasi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Event</th>
                  <th className="px-4 py-3.5">Tanggal</th>
                  <th className="px-4 py-3.5 text-center">Total Kuota</th>
                  <th className="px-4 py-3.5 text-center">Available</th>
                  <th className="px-4 py-3.5 text-center">Terjual</th>
                  <th className="px-4 py-3.5 text-center">Admitted</th>
                  <th className="px-4 py-3.5 text-center">Refunded</th>
                  <th className="px-4 py-3.5 text-center">Progress Penjualan</th>
                  <th className="px-6 py-3.5 text-right">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <TableSkeleton columns={9} rows={5} />
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-400">
                      {search ? 'Tidak ada event yang sesuai dengan pencarian.' : 'Belum ada event terdaftar.'}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt, idx) => {
                    const metrics = metricQueries[idx]?.data?.metrics ?? [];
                    const eventTotals = metrics.reduce(
                      (acc, m) => ({
                        total: acc.total + (m.total || 0),
                        available: acc.available + (m.available || 0),
                        sold: acc.sold + (m.sold || 0),
                        admitted: acc.admitted + (m.admitted || 0),
                        refunded: acc.refunded + (m.refunded || 0),
                      }),
                      { total: 0, available: 0, sold: 0, admitted: 0, refunded: 0 }
                    );

                    const percentage =
                      eventTotals.total > 0
                        ? Math.min(100, Math.round((eventTotals.sold / eventTotals.total) * 100))
                        : 0;

                    return (
                      <tr key={evt.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <p className="font-bold text-sm text-gray-900">{evt.name}</p>
                          <p className="text-gray-400 text-[11px] truncate max-w-50">{evt.location}</p>
                        </td>
                        <td className="px-4 py-4 text-gray-600 font-medium whitespace-nowrap">
                          {formatDate(evt.date)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-slate-800">{eventTotals.total}</td>
                        <td className="px-4 py-4 text-center font-bold text-green-600">{eventTotals.available}</td>
                        <td className="px-4 py-4 text-center font-bold text-[#0064D2]">{eventTotals.sold}</td>
                        <td className="px-4 py-4 text-center font-bold text-purple-600">{eventTotals.admitted}</td>
                        <td className="px-4 py-4 text-center font-bold text-red-600">{eventTotals.refunded}</td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#0064D2] h-full rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-700 w-8 text-right">{percentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setMetricEventId(evt.id)}
                              title="Lihat Metrik Detail"
                              className="p-2 rounded-xl bg-blue-50 text-[#0064D2] hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              <BarChart2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => navigate(`/organizer/events/${evt.id}/ticket-types`)}
                              title="Kelola Tiket"
                              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => navigate(`/organizer/events/${evt.id}/gate-operators`)}
                              title="Gate Operator"
                              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <Users className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => navigate(`/organizer/events/${evt.id}/edit`)}
                              title="Edit Event"
                              className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(evt.id, evt.name)}
                              disabled={isDeleting}
                              title="Hapus Event"
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {metricEventId && (
        <OrganizerEventMetricsModal eventId={metricEventId} onClose={() => setMetricEventId(null)} />
      )}
    </div>
  );
}
