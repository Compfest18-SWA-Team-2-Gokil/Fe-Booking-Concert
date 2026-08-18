import { XCircle, Clock, Copy, Check, CheckCircle2 } from 'lucide-react';
import type { RefundRequestItem } from '../../application/useOrganizerRefunds';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

interface OrganizerRefundsTableProps {
  refunds: RefundRequestItem[];
  isLoading: boolean;
  search: string;
  statusFilter: string;
  copiedId: string | null;
  onCopy: (id: string) => void;
  onApprove: (id: string, eventName: string, amount: number) => void;
  isApproving: boolean;
}

export function OrganizerRefundsTable({
  refunds,
  isLoading,
  search,
  statusFilter,
  copiedId,
  onCopy,
  onApprove,
  isApproving,
}: OrganizerRefundsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
        <div className="animate-spin w-8 h-8 border-4 border-[#0064D2] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-medium">Memuat data pengajuan refund...</p>
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-gray-900 text-base">Tidak Ada Pengajuan Refund</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
          {search || statusFilter !== 'ALL'
            ? 'Tidak ditemukan data refund yang sesuai dengan filter pencarian.'
            : 'Semua event Anda saat ini tidak memiliki sengketa refund yang tertunda.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 text-gray-600 uppercase font-bold border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5">Order ID & Pembeli</th>
              <th className="px-5 py-3.5">Nama Event</th>
              <th className="px-5 py-3.5">Nominal Refund</th>
              <th className="px-5 py-3.5 text-center">Status Alur Refund</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {refunds.map((r) => {
              const isRequested = r.status === 'REFUND_REQUESTED';
              const isApprovedByOrg = r.status === 'REFUND_ORGANIZER_APPROVED';
              const isRefunded = r.status === 'REFUNDED';

              return (
                <tr key={r.order_id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 font-mono text-gray-900 font-bold">
                      <span className="truncate max-w-[140px]">{r.order_id}</span>
                      <button
                        onClick={() => onCopy(r.order_id)}
                        className="text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                        title="Salin Order ID"
                      >
                        {copiedId === r.order_id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{r.buyer_email}</p>
                  </td>

                  <td className="px-5 py-4 text-gray-900 font-bold max-w-[200px] truncate">
                    {r.event_name}
                  </td>

                  <td className="px-5 py-4 font-black text-gray-900 text-sm">
                    {formatCurrency(r.total_amount)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {isRequested && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" /> Perlu Persetujuan Anda
                      </span>
                    )}
                    {isApprovedByOrg && (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0064D2] border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui Anda — Menunggu Admin
                      </span>
                    )}
                    {isRefunded && (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                        <Check className="w-3.5 h-3.5" /> Selesai — Dicairkan Admin
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {isRequested && (
                      <button
                        onClick={() => onApprove(r.order_id, r.event_name, r.total_amount)}
                        disabled={isApproving}
                        className="bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isApproving ? 'Memproses...' : 'Setujui Refund'}
                      </button>
                    )}
                    {isApprovedByOrg && (
                      <span className="text-xs text-slate-400 font-semibold italic">
                        Menunggu Eksekusi Admin
                      </span>
                    )}
                    {isRefunded && (
                      <span className="text-xs text-emerald-600 font-bold">
                        Dana Telah Kembali
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
