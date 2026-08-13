import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../infrastructure/authApi';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      email,
      name,
      password,
      role,
    }: {
      email: string;
      name: string;
      password: string;
      role: string;
    }) =>
      authApi
        .register({ email, name, password, role })
        .then((r) => r.data),
    onSuccess: () => {
      navigate('/login');
    },
  });
}
