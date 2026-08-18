import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

if (rawBaseURL && !rawBaseURL.startsWith('http://') && !rawBaseURL.startsWith('https://')) {
  rawBaseURL = `https://${rawBaseURL}`;
}

const baseURL = rawBaseURL.replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('tiketin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url || '';
      // Jangan bersihkan session jika yang 401 adalah form login/register
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        const hasToken = !!localStorage.getItem('tiketin_token');
        if (hasToken && url.includes('/auth/me')) {
          localStorage.removeItem('tiketin_token');
          localStorage.removeItem('tiketin_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
