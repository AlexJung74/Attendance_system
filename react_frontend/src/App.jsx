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

// 모든 Admin 관련 컴포넌트는 Admin 디렉토리 아래로 이동
import CourseManagement from './components/Admin/CourseManagement';
import SemesterManagement from './components/Admin/SemesterManagement';
import ClassManagement from './components/Admin/ClassManagement';
import LecturerManagement from './components/Admin/LecturerManagement';
import StudentManagement from './components/Admin/StudentManagement';

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
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <Login />} />
          <Route path="/dashboard" element={isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <Navigate to="/" />} />
          <Route path="/admin/dashboard" element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/lecturer/dashboard" element={isAuthenticated && userRole === 'lecturer' ? <LecturerDashboard /> : <Navigate to="/" />} />
          <Route path="/student/dashboard" element={isAuthenticated && userRole === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
          {/* Admin 관련 페이지 */}
          <Route path="/admin/courses" element={isAuthenticated && userRole === 'admin' ? <CourseManagement /> : <Navigate to="/" />} />
          <Route path="/admin/semesters" element={isAuthenticated && userRole === 'admin' ? <SemesterManagement /> : <Navigate to="/" />} />
          <Route path="/admin/classes" element={isAuthenticated && userRole === 'admin' ? <ClassManagement /> : <Navigate to="/" />} />
          <Route path="/admin/lecturers" element={isAuthenticated && userRole === 'admin' ? <LecturerManagement /> : <Navigate to="/" />} />
          <Route path="/admin/students" element={isAuthenticated && userRole === 'admin' ? <StudentManagement /> : <Navigate to="/" />} />
        </Routes>
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
