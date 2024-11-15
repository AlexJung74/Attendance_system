// src/App.jsx

import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuthState, useAuthDispatch } from './components/Auth/AuthContext';
import api from './components/api';

import Navbar from './components/Auth/Navbar';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import LecturerDashboard from './components/Dashboards/LecturerDashboard';
import StudentDashboard from './components/Dashboards/StudentDashboard';
import Login from './components/Auth/Login';
import CourseList from './components/Courses/CourseList';

function AppContent() {
  const { isAuthenticated, userRole } = useAuthState();
  const dispatch = useAuthDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await api.get('/auth/user/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          dispatch({ type: 'LOGIN', role: response.data.role });
        } catch (error) {
          console.error('Authentication failed:', error);
          localStorage.removeItem('accessToken');
          dispatch({ type: 'LOGOUT' });
        }
      }
      setIsInitialized(true);
    };
    initializeAuth();
  }, [dispatch]);

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <>
      {/* Navbar 고정 */}
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <Login />} />
            <Route path="/dashboard" element={isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <Navigate to="/" />} />
            <Route path="/admin/dashboard" element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/lecturer/dashboard" element={isAuthenticated && userRole === 'lecturer' ? <LecturerDashboard /> : <Navigate to="/" />} />
            <Route path="/student/dashboard" element={isAuthenticated && userRole === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/courses" element={isAuthenticated && userRole === 'admin' ? <CourseList /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
