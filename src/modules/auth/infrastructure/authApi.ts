import axiosInstance from '../../../core/api/axiosInstance';
import type { User } from '../domain/User';

interface RegisterPayload {
  email: string;
  username: string;
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

export interface AssignedOperator {
  user_id: string;
  username: string;
  name: string;
  email: string;
  assigned_at: string;
  assigned_by: string;
  status: string;
}

export interface AssignGateOperatorResponse {
  status: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
  assigned_at: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    axiosInstance.post<User>('/api/v1/auth/register', payload),

  login: (payload: LoginPayload) =>
    axiosInstance.post<LoginResponse>('/api/v1/auth/login', payload),

  me: () => axiosInstance.get<User>('/api/v1/auth/me'),

  logout: () => axiosInstance.post<{ message: string }>('/api/v1/auth/logout'),

  assignGateOperator: (eventId: string, username: string) =>
    axiosInstance.post<AssignGateOperatorResponse>(
      `/api/v1/events/${eventId}/gate-operators`,
      { username }
    ),

  listGateOperators: (eventId: string) =>
    axiosInstance.get<AssignedOperator[]>(
      `/api/v1/events/${eventId}/gate-operators`
    ),

  removeGateOperator: (eventId: string, userId: string) =>
    axiosInstance.delete(
      `/api/v1/events/${eventId}/gate-operators/${userId}`
    ),

  searchGateOperators: (query: string) =>
    axiosInstance.get<User[]>('/api/v1/users', {
      params: { role: 'GATE_OPERATOR', q: query },
    }),
};
