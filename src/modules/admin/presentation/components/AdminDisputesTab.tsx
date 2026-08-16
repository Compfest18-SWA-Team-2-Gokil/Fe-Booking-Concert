import { CheckCircle2, Sliders } from 'lucide-react';
import type { DisputeOrder } from '../../infrastructure/adminApi';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

interface AdminDisputesTabProps {
  disputes: DisputeOrder[];
  isLoading: boolean;
  onOpenOverride: (order: DisputeOrder) => void;
  onOpenReassign: () => void;
}

export function AdminDisputesTab({
  disputes,
  isLoading,
  onOpenOverride,
  onOpenReassign,
}: AdminDisputesTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Daftar Sengketa & Transaksi Anomali</h2>
            <p className="text-xs text-gray-500">
              Menangani pesanan Payment Discrepancy (kursi kadaluarsa/direbut) & Permintaan Refund
            </p>
          </div>
          <button
            onClick={onOpenReassign}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            Pindahkan Kepemilikan Tiket (Reassign)
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-400">Memuat daftar sengketa...</div>
        ) : disputes.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-gray-900 text-sm">Tidak ada sengketa aktif</p>
            <p className="text-xs text-gray-500">Semua transaksi berjalan lancar tanpa anomali.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Buyer Email</th>
                  <th className="px-4 py-3">Status Anomali</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3 text-right">Aksi Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {disputes.map((order) => {
                  const orderId = order.order_id || order.id || '';
                  return (
                    <tr key={orderId} className="hover:bg-gray-50/70">
                      <td className="px-4 py-3 font-mono font-bold text-gray-900">{orderId}</td>
                      <td className="px-4 py-3 text-gray-600">{order.buyer_email || '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'REFUND_REQUESTED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">
                        {new Date(order.updated_at || order.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onOpenOverride(order)}
                          className="bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                        >
                          Override Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
