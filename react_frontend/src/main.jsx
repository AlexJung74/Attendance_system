// src/main.jsx

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import { AuthProvider } from './components/Auth/AuthContext';

// Axios 기본 URL 설정 (환경에 따라 분리)
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'https://attendance-system-asg1.vercel.app/api' // 프로덕션 백엔드
  : 'http://localhost:8000/api'; // 개발 환경 백엔드

// React 애플리케이션 루트 생성
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
