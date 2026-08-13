import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../infrastructure/authApi';
import { useAuth } from './useAuth';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login({ email, password }).then((r) => r.data),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/events');
    },
  });
}
