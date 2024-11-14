// src/components/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request 인터셉터: 요청에 인증 토큰을 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken'); // `access` 대신 `accessToken`으로 수정
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터: 토큰이 만료되었을 경우 자동으로 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 시 리프레시 토큰으로 갱신 시도
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 리트라이 플래그 설정

      const refreshToken = localStorage.getItem('refreshToken'); // `refresh` 대신 `refreshToken`으로 수정
      if (refreshToken) {
        try {
          // 리프레시 토큰을 사용하여 새 액세스 토큰 발급
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });
          localStorage.setItem('accessToken', response.data.access); // 새 `accessToken` 저장
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest); // 원래 요청을 재시도
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // 리프레시 실패 시 토큰 삭제 및 리다이렉트
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/'; // 로그인 페이지로 리다이렉트
        }
      } else {
        // 리프레시 토큰이 없을 경우에도 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/'; // 로그인 페이지로 리다이렉트
      }
    }
    return Promise.reject(error);
  }
);

export default api;
