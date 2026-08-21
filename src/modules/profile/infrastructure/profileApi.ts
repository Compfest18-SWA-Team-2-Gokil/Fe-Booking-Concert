import axiosInstance from '../../../core/api/axiosInstance';
import type { ProfileData, UsernameAvailability } from '../domain/types';

export const profileApi = {
  getMe: () => axiosInstance.get<ProfileData>('/api/v1/auth/me'),

  updateUsername: (username: string) =>
    axiosInstance.put<ProfileData>('/api/v1/auth/me/username', { username }),

  changePassword: (old_password: string, new_password: string) =>
    axiosInstance.put('/api/v1/auth/me/password', { old_password, new_password }),

  checkUsername: (username: string) =>
    axiosInstance.get<UsernameAvailability>('/api/v1/auth/username-check', {
      params: { username },
    }),
};
