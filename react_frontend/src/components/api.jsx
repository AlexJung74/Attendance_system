// src/components/api.jsx

import axios from 'axios';

console.log('Backend URL:', process.env.VITE_BACKEND_URL);
const baseURL = process.env.VITE_BACKEND_URL?.endsWith('/api')
  ? process.env.VITE_BACKEND_URL
  : `${process.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api`;

const api = axios.create({
  baseURL,
});

// Request 인터셉터: 모든 요청에 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Access token set in request:", accessToken);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터: 토큰 만료 시 자동으로 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${baseURL}/token/refresh/`,
            { refresh: refreshToken }
          );
          localStorage.setItem('accessToken', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest); // 요청 재시도
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          alert('Your session has expired. Please log in again.');
          localStorage.clear(); // 모든 로컬 스토리지 데이터 삭제
          window.location.href = '/'; // 로그인 화면으로 리디렉션
        }
      } else {
        alert('Authentication required. Please log in.');
        localStorage.clear();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);


export default api;
