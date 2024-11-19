// src/components/Auth/Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthDispatch } from './AuthContext.jsx';
import './Login.css'; // CSS 파일 추가

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태 추가
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('Attempting login with:', { username, password });
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

    setIsSubmitting(true); // 로그인 시작 시 버튼 비활성화
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login/`,
        { username, password }
      );
      console.log('Login successful, response data:', response.data);

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      dispatch({
        type: 'LOGIN',
        role: response.data.is_superuser
          ? 'admin'
          : response.data.is_lecturer
          ? 'lecturer'
          : 'student',
      });

      if (response.data.is_superuser) {
        navigate('/admin/dashboard', { replace: true });
      } else if (response.data.is_lecturer) {
        navigate('/lecturer/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false); // 요청 완료 후 버튼 활성화
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to Maungawhau College Attendance Systems</h1>
      <img src="/logo1.png" alt="College Logo" className="college-logo" />
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="login-button"
          disabled={isSubmitting} // 버튼 활성화 상태 관리
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
