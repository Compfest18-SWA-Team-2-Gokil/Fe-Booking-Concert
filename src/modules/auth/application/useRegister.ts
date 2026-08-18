import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../infrastructure/authApi';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      email,
      username,
      name,
      password,
      role,
    }: {
      email: string;
      username: string;
      name: string;
      password: string;
      role: string;
    }) =>
      authApi
        .register({ email, username, name, password, role })
        .then((r) => r.data),
    onSuccess: () => {
      navigate('/login');
    },
  });
}
