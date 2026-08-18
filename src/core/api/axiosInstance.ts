import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true, // Mengizinkan pengiriman & penerimaan HttpOnly Cookie secara otomatis
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('tiketin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
