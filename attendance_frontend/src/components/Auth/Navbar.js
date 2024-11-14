// src/components/Navigation/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ userRole }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 로그아웃 요청을 보내고, 성공 시 토큰 삭제 및 리다이렉트
            await axios.post('/api/auth/logout/', null, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
            // 로그아웃이 실패해도 클라이언트 쪽에서는 토큰을 제거하고 로그인 페이지로 리다이렉트
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/', { replace: true });
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Link className="navbar-brand" to="/dashboard">Attendance System</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    {userRole === 'admin' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/semesters">Semesters</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/courses">Courses</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/classes">Classes</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/lecturers">Lecturers</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/students">Students</Link>
                            </li>
                        </>
                    )}
                    {userRole === 'lecturer' && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/lecturer/dashboard">Dashboard</Link>
                        </li>
                    )}
                    {userRole === 'student' && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/student/dashboard">My Attendance</Link>
                        </li>
                    )}
                </ul>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <button className="btn btn-link nav-link" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
