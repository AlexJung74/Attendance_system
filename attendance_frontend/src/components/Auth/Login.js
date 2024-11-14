// src/components/Auth/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        // 로그인 요청 시도 전에 입력 값과 URL 확인
        console.log('Attempting login with:', { username, password });

        try {
            const response = await axios.post('/api/auth/login/', { username, password });

            // 로그인 성공 시 응답 데이터 확인
            console.log('Login successful, response data:', response.data);

            localStorage.setItem('token', response.data.token);

            // 사용자 역할에 따른 리다이렉션 로직 확인
            if (response.data.is_superuser) {
                console.log('Navigating to Admin Dashboard');
                navigate('/admin/dashboard');
            } else if (response.data.is_lecturer) {
                console.log('Navigating to Lecturer Dashboard');
                navigate('/lecturer/dashboard');
            } else {
                console.log('Navigating to Student Dashboard');
                navigate('/student/dashboard');
            }
        } catch (error) {
            // 로그인 실패 시 오류 로그 확인
            console.error('Login failed:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
