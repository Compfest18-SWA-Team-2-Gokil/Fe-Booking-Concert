import {
  Calendar,
  Layers,
  TrendingUp,
  CheckCircle2,
  Zap,
  RotateCcw,
  Search,
} from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';
import { formatDate } from '../../../../core/utils/formatDate';
import type { Event } from '../../../events/domain/models/Event';
import type { EventMetricsResponse } from '../../application/useAdminMetrics';
import { TableSkeleton } from '../../../../shared/components/ui/TableSkeleton';

interface AdminMetricsTabProps {
  events: Event[] | undefined;
  eventsLoading: boolean;
  filteredEvents: Event[];
  platformStats: {
    totalQuota: number;
    available: number;
    held: number;
    sold: number;
    admitted: number;
    refunded: number;
  };
  metricQueries: UseQueryResult<EventMetricsResponse, Error>[];
  search: string;
  onSearchChange: (val: string) => void;
}

export function AdminMetricsTab({
  events,
  eventsLoading,
  filteredEvents,
  platformStats,
  metricQueries,
  search,
  onSearchChange,
}: AdminMetricsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Event</span>
            <Calendar className="w-4 h-4 text-[#0064D2]" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {eventsLoading ? '...' : events?.length ?? 0}
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Event terdaftar</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Kuota</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            {platformStats.totalQuota.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Unit tiket diterbitkan</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terjual</span>
            <TrendingUp className="w-4 h-4 text-[#0064D2]" />
          </div>
          <div className="text-2xl font-black text-[#0064D2]">
            {platformStats.sold.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1">
            {platformStats.totalQuota > 0
              ? `${Math.round((platformStats.sold / platformStats.totalQuota) * 100)}% terjual`
              : '0%'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admitted</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">
            {platformStats.admitted.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-purple-600 font-medium mt-1">Scan gate masuk</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sedang Hold</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {platformStats.held.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Reservasi 5 menit</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Refunded</span>
            <RotateCcw className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600">
            {platformStats.refunded.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Tiket dibatalkan</span>
        </div>
      </div>

      {/* Graph and Highest Grossing Event */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-gray-900 self-start mb-4">Total Penjualan vs Total Kuota</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8 w-full justify-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  className="stroke-gray-100"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  className="stroke-[#0064D2]"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={
                    2 * Math.PI * 60 - 
                    ((platformStats.totalQuota > 0 ? (platformStats.sold / platformStats.totalQuota) : 0) * 2 * Math.PI * 60)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-gray-900">
                  {platformStats.totalQuota > 0
                    ? Math.round((platformStats.sold / platformStats.totalQuota) * 100)
                    : 0}%
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Terjual</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total Kuota Platform</p>
                <p className="text-2xl font-black text-slate-800">{platformStats.totalQuota.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Tiket Terjual</p>
                <p className="text-2xl font-black text-[#0064D2]">{platformStats.sold.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Highest Grossing Event
          </h3>
          
          {(() => {
            if (eventsLoading) return <div className="text-sm text-gray-400">Loading...</div>;
            
            const eventsWithMetrics = (events ?? []).map((evt, idx) => {
              const metrics = metricQueries[idx]?.data?.metrics ?? [];
              const totals = metrics.reduce(
                (acc, m) => ({
                  total: acc.total + (m.total || 0),
                  sold: acc.sold + (m.sold || 0),
                }),
                { total: 0, sold: 0 }
              );
              return { evt, totals };
            });

            const highest = eventsWithMetrics.length > 0
              ? eventsWithMetrics.reduce((prev, current) => 
                  prev.totals.sold > current.totals.sold ? prev : current
                )
              : null;

            if (!highest || highest.totals.sold === 0) {
              return <div className="text-sm text-gray-400 my-auto text-center">Belum ada data penjualan</div>;
            }

            const percentage = highest.totals.total > 0
              ? Math.round((highest.totals.sold / highest.totals.total) * 100)
              : 0;

            return (
              <div className="flex flex-col gap-4 flex-1 justify-center">
                <div className="flex items-center gap-4">
                  {highest.evt.image_url ? (
                    <img 
                      src={highest.evt.image_url} 
                      alt={highest.evt.name} 
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-black text-gray-900 line-clamp-2 leading-tight">
                      {highest.evt.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {highest.evt.location} • {formatDate(highest.evt.date)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Terjual</span>
                    <span className="text-sm font-black text-[#0064D2]">{highest.totals.sold.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Total Kuota</span>
                    <span className="text-sm font-black text-gray-700">{highest.totals.total.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Progress</span>
                      <span className="text-xs font-bold text-gray-700">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#0064D2] h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Event List & Metrics Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Semua Event & Metrik Penjualan</h2>
            <p className="text-xs text-gray-500">Data live kuota dan performa masing-masing event</p>
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
                <th className="px-6 py-3.5 text-right">Progress Penjualan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eventsLoading ? (
                <TableSkeleton columns={8} rows={5} />
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                    Tidak ada event yang sesuai.
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
                      <td className="px-4 py-4 text-gray-600 font-medium">{formatDate(evt.date)}</td>
                      <td className="px-4 py-4 text-center font-bold text-slate-800">{eventTotals.total}</td>
                      <td className="px-4 py-4 text-center font-bold text-green-600">{eventTotals.available}</td>
                      <td className="px-4 py-4 text-center font-bold text-[#0064D2]">{eventTotals.sold}</td>
                      <td className="px-4 py-4 text-center font-bold text-purple-600">{eventTotals.admitted}</td>
                      <td className="px-4 py-4 text-center font-bold text-red-600">{eventTotals.refunded}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#0064D2] h-full rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-gray-700 w-10 text-right">{percentage}%</span>
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
  );
}
