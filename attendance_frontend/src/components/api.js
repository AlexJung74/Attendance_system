import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
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
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });
          localStorage.setItem('accessToken', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);  // 요청 재시도
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';  // 로그인 화면으로 이동
        }
      } else {
        console.warn('No refresh token found. Logging out.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';  // 로그인 화면으로 이동
      }
    }
    return Promise.reject(error);
  }
);

export default api;
