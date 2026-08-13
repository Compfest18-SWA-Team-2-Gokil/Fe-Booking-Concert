import axiosInstance from '../../../core/api/axiosInstance';
import type { User } from '../domain/User';

interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  role: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    axiosInstance.post<User>('/api/v1/auth/register', payload),

  login: (payload: LoginPayload) =>
    axiosInstance.post<LoginResponse>('/api/v1/auth/login', payload),

  me: () => axiosInstance.get<User>('/api/v1/auth/me'),
};
