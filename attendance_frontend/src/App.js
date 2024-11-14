// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState, useAuthDispatch } from './components/Auth/AuthContext';
import api from './components/api';

import Navbar from './components/Navigation/Navbar';
import AdminDashboard from './components/Admin/AdminDashboard';
import LecturerDashboard from './components/Lecturer/LecturerDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import Login from './components/Auth/Login';

function App() {
  const { isAuthenticated, userRole } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        try {
          const response = await api.get('/auth/user/');
          dispatch({ type: 'LOGIN', role: response.data.role });
        } catch {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
    initializeAuth();
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <Login />} />

        {/* 기본 "/dashboard" 경로를 역할 기반 대시보드로 리다이렉트 */}
        <Route path="/dashboard" element={isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <Navigate to="/" />} />

        <Route path="/admin/dashboard" element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/lecturer/dashboard" element={isAuthenticated && userRole === 'lecturer' ? <LecturerDashboard /> : <Navigate to="/" />} />
        <Route path="/student/dashboard" element={isAuthenticated && userRole === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
