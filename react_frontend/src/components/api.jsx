import axios from 'axios';

const baseURL = `${
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:8000'
}/api`;

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

// Response 인터셉터: 응답 에러 처리
api.interceptors.response.use(
  (response) => response, // 성공적인 응답 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const tokenResponse = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = tokenResponse.data.access;
          localStorage.setItem('accessToken', newAccessToken);

          // 원래 요청에 새 토큰 추가
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // 요청 재시도
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
      } else {
        console.error('No refresh token available.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
