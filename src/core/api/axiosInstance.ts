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

export default axiosInstance;
