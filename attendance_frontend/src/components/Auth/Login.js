import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthDispatch } from './AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('Attempting login with:', { username, password });

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', { username, password });
      console.log('Login successful, response data:', response.data);

      // accessToken과 refreshToken을 정확한 키로 localStorage에 저장
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      console.log("Stored accessToken:", localStorage.getItem('accessToken'));
      console.log("Stored refreshToken:", localStorage.getItem('refreshToken'));

      dispatch({ type: 'LOGIN', role: response.data.is_superuser ? 'admin' : response.data.is_lecturer ? 'lecturer' : 'student' });

      if (response.data.is_superuser) {
        navigate('/admin/dashboard', { replace: true });
      } else if (response.data.is_lecturer) {
        navigate('/lecturer/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        name="username"
        id="username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        name="password"
        id="password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
