// src/components/api.jsx

import axios from 'axios';

const baseURL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api`;

const api = axios.create({
  baseURL,
});

// Request 인터셉터: 모든 요청에 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
