import { Calendar, Layers, TrendingUp, CheckCircle2, Zap, RotateCcw } from 'lucide-react';

interface OrganizerStats {
  totalQuota: number;
  available: number;
  held: number;
  sold: number;
  admitted: number;
  refunded: number;
}

interface OrganizerKpiCardsProps {
  totalEvents: number;
  stats: OrganizerStats;
}

export function OrganizerKpiCards({ totalEvents, stats }: OrganizerKpiCardsProps) {
  const soldPercent = stats.totalQuota > 0 ? Math.round((stats.sold / stats.totalQuota) * 100) : 0;
  const admittedPercent = stats.sold > 0 ? Math.round((stats.admitted / stats.sold) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Event</span>
          <Calendar className="w-4 h-4 text-[#0064D2]" />
        </div>
        <div className="text-2xl font-black text-gray-900">{totalEvents}</div>
        <span className="text-[11px] text-gray-400 mt-1">Event aktif</span>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Kuota</span>
          <Layers className="w-4 h-4 text-slate-600" />
        </div>
        <div className="text-2xl font-black text-slate-800">{stats.totalQuota.toLocaleString('id-ID')}</div>
        <span className="text-[11px] text-gray-400 mt-1">Unit tiket</span>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terjual</span>
          <TrendingUp className="w-4 h-4 text-[#0064D2]" />
        </div>
        <div className="text-2xl font-black text-[#0064D2]">{stats.sold.toLocaleString('id-ID')}</div>
        <span className="text-[11px] text-emerald-600 font-medium mt-1">{soldPercent}% terjual</span>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tersedia</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-emerald-600">{stats.available.toLocaleString('id-ID')}</div>
        <span className="text-[11px] text-gray-400 mt-1">Siap dipesan</span>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check-In</span>
          <Zap className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-2xl font-black text-purple-600">{stats.admitted.toLocaleString('id-ID')}</div>
        <span className="text-[11px] text-gray-400 mt-1">{admittedPercent}% scan gate</span>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Refunded</span>
          <RotateCcw className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-2xl font-black text-red-600">{stats.refunded.toLocaleString('id-ID')}</div>
        <span className="text-[11px] text-gray-400 mt-1">Dibatalkan</span>
      </div>
    </div>
  );
}
