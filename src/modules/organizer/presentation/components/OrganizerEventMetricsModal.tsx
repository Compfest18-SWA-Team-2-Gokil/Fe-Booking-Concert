import { useQuery } from '@tanstack/react-query';
import { BarChart3, X } from 'lucide-react';
import axiosInstance from '../../../../core/api/axiosInstance';

interface TicketTypeMetrics {
  ticket_type_id: string;
  available: number;
  held: number;
  sold: number;
  admitted: number;
  refunded: number;
  total: number;
}

interface OrganizerEventMetricsModalProps {
  eventId: string;
  onClose: () => void;
}

export function OrganizerEventMetricsModal({
  eventId,
  onClose,
}: OrganizerEventMetricsModalProps) {
  const { data, isLoading } = useQuery<{ event_id: string; metrics: TicketTypeMetrics[] }>({
    queryKey: ['metrics', eventId],
    queryFn: () => axiosInstance.get(`/api/v1/events/${eventId}/metrics`).then((r) => r.data),
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100">
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
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Kuota</span>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{totals.total}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Tersedia</span>
              <p className="text-2xl font-black text-green-700 mt-0.5">{totals.available}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold text-[#0064D2] uppercase tracking-wider">Terjual</span>
              <p className="text-2xl font-black text-[#0064D2] mt-0.5">{totals.sold}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Sedang Hold</span>
              <p className="text-2xl font-black text-amber-700 mt-0.5">{totals.held}</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Admitted</span>
              <p className="text-2xl font-black text-purple-700 mt-0.5">{totals.admitted}</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Refunded</span>
              <p className="text-2xl font-black text-red-700 mt-0.5">{totals.refunded}</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
