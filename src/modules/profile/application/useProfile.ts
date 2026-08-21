import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../infrastructure/profileApi';

export function useProfile() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMe().then((r) => r.data),
    staleTime: 0,
  });

  return { profile: data ?? null, isLoading, isError, refetch };
}
