import type { AuditLog } from '../../infrastructure/adminApi';

interface AdminAuditLogsTabProps {
  auditLogs: AuditLog[];
  total: number;
  isLoading: boolean;
}

export function AdminAuditLogsTab({
  auditLogs,
  total,
  isLoading,
}: AdminAuditLogsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Immutable Audit Trail Logs</h2>
            <p className="text-xs text-gray-500">
              Catatan permanen mutasi status tiket, order override, dan tindakan admin
            </p>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl">
            Total {total} Logs
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-400">Memuat audit log...</div>
        ) : auditLogs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">Belum ada audit log tercatat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Aksi</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Target ID</th>
                  <th className="px-4 py-3">Admin / Actor</th>
                  <th className="px-4 py-3">Alasan / Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.map((log) => {
                  const entity = log.entity_name || log.entity_type || 'order';
                  const actor = log.actor_email || log.performed_by || log.actor_role || 'System';
                  const reasonText = log.reason || (log.from_state && log.to_state ? `${log.from_state} -> ${log.to_state}` : '-');

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-3 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#0064D2] bg-blue-50 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-700 uppercase text-[11px]">{entity}</td>
                      <td className="px-4 py-3 font-mono text-gray-900">{log.entity_id}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-[11px]">{actor}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{reasonText}</td>
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
