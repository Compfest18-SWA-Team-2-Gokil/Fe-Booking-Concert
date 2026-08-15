import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Zap,
  Layers,
  Search,
} from 'lucide-react';
import { useEvents } from '../../../events/application/useEvents';
import axiosInstance from '../../../../core/api/axiosInstance';
import { formatDate } from '../../../../core/utils/formatDate';

interface EventMetricsResponse {
  event_id: string;
  metrics: {
    ticket_type_id: string;
    available: number;
    held: number;
    sold: number;
    admitted: number;
    refunded: number;
    total: number;
  }[];
}

export function AdminDashboardPage() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const [search, setSearch] = useState('');

  // Fetch metrics for every event
  const metricQueries = useQueries({
    queries: (events ?? []).map((e) => ({
      queryKey: ['metrics', e.id],
      queryFn: () =>
        axiosInstance
          .get<EventMetricsResponse>(`/api/v1/events/${e.id}/metrics`)
          .then((r) => r.data),
      refetchInterval: 15_000,
    })),
  });

  // Calculate platform-wide totals
  const platformStats = metricQueries.reduce(
    (acc, query) => {
      if (!query.data?.metrics) return acc;
      for (const m of query.data.metrics) {
        acc.totalQuota += m.total || 0;
        acc.available += m.available || 0;
        acc.held += m.held || 0;
        acc.sold += m.sold || 0;
        acc.admitted += m.admitted || 0;
        acc.refunded += m.refunded || 0;
      }
      return acc;
    },
    {
      totalQuota: 0,
      available: 0,
      held: 0,
      sold: 0,
      admitted: 0,
      refunded: 0,
    }
  );

  const filteredEvents = (events ?? []).filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0064D2]">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator Hub
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Ringkasan Platform & Tiket
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring penjualan, kuota tiket, dan check-in real-time di seluruh event.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Events */}
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

          {/* Total Kapasitas Tiket */}
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

          {/* Tiket Terjual */}
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

          {/* Admitted / Check-in */}
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

          {/* Held (Reservasi Aktif) */}
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

          {/* Refunded */}
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

        {/* Backend System Architecture Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 border border-blue-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Anti-Oversell</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base mb-1">PostgreSQL Lock</h3>
            <p className="text-xs text-blue-200">
              Pencegahan overbooking menggunakan SELECT FOR UPDATE dengan deterministic sorting.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Waiting Room</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base mb-1">Redis Sorted Set</h3>
            <p className="text-xs text-slate-300">
              Queue virtual dengan rate limiting otomatis saat traffic di atas 100 req/s.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Gate Check-in</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base mb-1">HMAC-SHA256</h3>
            <p className="text-xs text-slate-300">
              Validasi cryptographic signature QR code anti-duplikasi saat admit.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Payment Gateway</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base mb-1">Xendit Invoice</h3>
            <p className="text-xs text-slate-300">
              Idempotent payment creation, refund webhook, dan real-time callback support.
            </p>
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
                  <th className="px-6 py-3.5 text-right">Progress Penjualan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eventsLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                      Memuat data event...
                    </td>
                  </tr>
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
                          <p className="text-gray-400 text-[11px] truncate max-w-[200px]">{evt.location}</p>
                        </td>
                        <td className="px-4 py-4 text-gray-600 font-medium">
                          {formatDate(evt.date)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-slate-800">
                          {eventTotals.total}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-green-600">
                          {eventTotals.available}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-[#0064D2]">
                          {eventTotals.sold}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-purple-600">
                          {eventTotals.admitted}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-red-600">
                          {eventTotals.refunded}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#0064D2] h-full rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-700 w-10 text-right">
                              {percentage}%
                            </span>
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
    </div>
  );
}
