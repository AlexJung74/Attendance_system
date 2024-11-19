// src/main.jsx

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import axios from 'axios';
import { AuthProvider } from './components/Auth/AuthContext.jsx';

// Axios 기본 URL 설정 (환경에 따라 분리)
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// React 애플리케이션 루트 생성
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
