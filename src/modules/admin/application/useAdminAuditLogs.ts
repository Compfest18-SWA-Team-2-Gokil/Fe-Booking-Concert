import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../infrastructure/adminApi';
import { useAuth } from '../../auth/application/useAuth';

export function useAdminAuditLogs() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;

  const query = useQuery({
    queryKey: ['admin-audit-logs', page, limit],
    queryFn: () => adminApi.getAuditLogs(page, limit),
    enabled: user?.role === 'ADMIN',
    refetchInterval: 15_000,
    placeholderData: (prev) => prev,
  });

  return {
    page,
    setPage,
    pagination: query.data?.pagination,
    auditLogs: query.data?.audit_logs ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
  };
}
