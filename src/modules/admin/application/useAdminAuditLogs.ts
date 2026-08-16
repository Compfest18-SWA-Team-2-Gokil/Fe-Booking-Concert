import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../infrastructure/adminApi';

export function useAdminAuditLogs(limit = 100) {
  const query = useQuery({
    queryKey: ['admin-audit-logs', limit],
    queryFn: () => adminApi.getAuditLogs(limit),
    refetchInterval: 15_000,
  });

  return {
    auditLogs: query.data?.audit_logs ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
  };
}
