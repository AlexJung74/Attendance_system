// src/components/Navigation/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ userRole }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout/', null, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
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
