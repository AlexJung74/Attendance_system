// src/components/Navigation/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ isAuthenticated, userRole, userName }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 로그아웃 요청 처리
      await axios.post('/api/auth/logout/', null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // 실패 시에도 클라이언트 토큰 제거 및 리디렉션
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/', { replace: true });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <Link className="navbar-brand" to="/dashboard">Attendance System</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              {userRole === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/classes">Classes</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/lecturers">Lecturers</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/students">Students</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/courses">Courses</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/semesters">Semesters</Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
        <ul className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="navbar-text me-3">Logged in as {userName}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
