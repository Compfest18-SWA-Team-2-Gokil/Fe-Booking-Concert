import { ShieldCheck, History } from 'lucide-react';
import type { AuditLog } from '../../infrastructure/adminApi';
import type { PaginationMeta } from '../../../../shared/components/ui/Pagination';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { TableSkeleton } from '../../../../shared/components/ui/TableSkeleton';

interface AdminAuditLogsTabProps {
  auditLogs: AuditLog[];
  pagination?: PaginationMeta;
  onPageChange?: (newPage: number) => void;
  isLoading: boolean;
}

export function AdminAuditLogsTab({
  auditLogs,
  pagination,
  onPageChange,
  isLoading,
}: AdminAuditLogsTabProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">Audit Trail (Immutable Activity Log)</h2>
          <p className="text-xs text-gray-500">
            Seluruh intervensi manual Admin dan riwayat perubahan status terekam secara permanen untuk kepatuhan hukum.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Log Aktif & Terlindungi</span>
        </div>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Waktu (WIB)</th>
                <th className="px-4 py-3">Pelaku / Admin</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Target Entitas</th>
                <th className="px-4 py-3">Perubahan Status</th>
                <th className="px-4 py-3">Alasan / Catatan</th>
              </tr>
            </thead>
            <TableSkeleton columns={7} rows={5} />
          </table>
        </div>
      ) : auditLogs.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-xs">Belum ada catatan aktivitas admin.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Waktu (WIB)</th>
                <th className="px-4 py-3">Pelaku / Admin</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Target Entitas</th>
                <th className="px-4 py-3">Perubahan Status</th>
                <th className="px-4 py-3">Alasan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => {
                const actor = log.actor_email || log.performed_by || log.actor_id || 'System';
                const fromS = log.from_status || log.from_state;
                const toS = log.to_status || log.to_state;
                const entityType = log.entity_type || log.entity_name || 'Entitas';

                return (
                  <tr key={log.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{actor}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.actor_role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[#0064D2]">{log.action}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 text-[11px]">
                      {entityType} #{log.entity_id?.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-[11px]">
                      {fromS && toS ? (
                        <span className="flex items-center gap-1 font-mono">
                          <span className="text-gray-400">{fromS}</span>
                          <span>&rarr;</span>
                          <span className="font-bold text-gray-800">{toS}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={log.reason}>
                      {log.reason || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination && onPageChange && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          className="mt-4 border-t border-gray-100 pt-3"
        />
      )}
    </div>
  );
}
