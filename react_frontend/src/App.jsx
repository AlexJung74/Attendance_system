import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuthState, useAuthDispatch } from './components/Auth/AuthContext';
import api from './components/api';

import Navbar from './components/Auth/Navbar'; // Navbar 추가
import LecturerDashboard from './components/Dashboards/LecturerDashboard';
import StudentDashboard from './components/Dashboards/StudentDashboard';
import Login from './components/Auth/Login';

// Admin 관련 컴포넌트
import AdminDashboard from './components/Dashboards/AdminDashboard';
import CourseManagement from './components/Admin/CourseManagement';
import SemesterManagement from './components/Admin/SemesterManagement';
import ClassManagement from './components/Admin/ClassManagement';
import LecturerManagement from './components/Admin/LecturerManagement';
import StudentManagement from './components/Admin/StudentManagement';
import CheckAttendance from './components/Admin/CheckAttendance';

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

  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar 공통으로 모든 페이지에 적용 */}
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />

      <Routes>
        {/* 기본 경로 */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} /> : <Login />}
        />

        {/* Admin 경로 */}
        {isAuthenticated && userRole === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/check-attendance" element={<CheckAttendance />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            <Route path="/admin/semesters" element={<SemesterManagement />} />
            <Route path="/admin/classes" element={<ClassManagement />} />
            <Route path="/admin/lecturers" element={<LecturerManagement />} />
            <Route path="/admin/students" element={<StudentManagement />} />
          </>
        )}

        {/* Lecturer 경로 */}
        {isAuthenticated && userRole === 'lecturer' && (
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        )}

        {/* Student 경로 */}
        {isAuthenticated && userRole === 'student' && (
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        )}

        {/* 404 처리 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
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
