import { Search, BarChart2, Ticket, Users, Edit, Trash2 } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Event } from '../../../../events/domain/models/Event';
import type { EventMetricsResponse } from '../../../application/useOrganizerEvents';
import { formatDate } from '../../../../../core/utils/formatDate';

interface OrganizerEventsTableProps {
  events: Event[];
  metricQueries: UseQueryResult<EventMetricsResponse, Error>[];
  search: string;
  isLoading: boolean;
  isDeleting: boolean;
  onSearchChange: (val: string) => void;
  onOpenMetrics: (id: string) => void;
  onManageTickets: (id: string) => void;
  onManageOperators: (id: string) => void;
  onEditEvent: (id: string) => void;
  onDeleteEvent: (id: string, name: string) => void;
}

export function OrganizerEventsTable({
  events,
  metricQueries,
  search,
  isLoading,
  isDeleting,
  onSearchChange,
  onOpenMetrics,
  onManageTickets,
  onManageOperators,
  onEditEvent,
  onDeleteEvent,
}: OrganizerEventsTableProps) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
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
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-400">
                  Memuat data event...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-400">
                  {search ? 'Tidak ada event yang sesuai dengan pencarian.' : 'Belum ada event terdaftar.'}
                </td>
              </tr>
            ) : (
              events.map((evt, idx) => {
                const metrics = metricQueries[idx]?.data?.metrics ?? [];
                const eventTotals = metrics.reduce(
                  (acc: { total: number; available: number; sold: number; admitted: number; refunded: number }, m: { total?: number; available?: number; sold?: number; admitted?: number; refunded?: number }) => ({
                    total: acc.total + (m.total || 0),
                    available: acc.available + (m.available || 0),
                    sold: acc.sold + (m.sold || 0),
                    admitted: acc.admitted + (m.admitted || 0),
                    refunded: acc.refunded + (m.refunded || 0),
                  }),
                  { total: 0, available: 0, sold: 0, admitted: 0, refunded: 0 }
                );

                const percentage =
                  eventTotals.total > 0 ? Math.min(100, Math.round((eventTotals.sold / eventTotals.total) * 100)) : 0;

                return (
                  <tr key={evt.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <p className="font-bold text-sm text-gray-900">{evt.name}</p>
                      <p className="text-gray-400 text-[11px] truncate max-w-[200px]">{evt.location}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600 font-medium whitespace-nowrap">{formatDate(evt.date)}</td>
                    <td className="px-4 py-4 text-center font-bold text-slate-800">{eventTotals.total}</td>
                    <td className="px-4 py-4 text-center font-bold text-green-600">{eventTotals.available}</td>
                    <td className="px-4 py-4 text-center font-bold text-[#0064D2]">{eventTotals.sold}</td>
                    <td className="px-4 py-4 text-center font-bold text-purple-600">{eventTotals.admitted}</td>
                    <td className="px-4 py-4 text-center font-bold text-red-600">{eventTotals.refunded}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#0064D2] h-full rounded-full transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="font-bold text-gray-700 w-8 text-right">{percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenMetrics(evt.id)}
                          title="Lihat Metrik Detail"
                          className="p-2 rounded-xl bg-blue-50 text-[#0064D2] hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onManageTickets(evt.id)}
                          title="Kelola Tiket"
                          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onManageOperators(evt.id)}
                          title="Gate Operator"
                          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditEvent(evt.id)}
                          title="Edit Event"
                          className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEvent(evt.id, evt.name)}
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
  );
}
