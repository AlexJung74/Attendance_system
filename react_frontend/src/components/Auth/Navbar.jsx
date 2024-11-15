// src/components/Navigation/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ isAuthenticated, userRole }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout/', null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
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
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
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
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/semesters">Semesters</Link>
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
            </>
          )}
        </ul>
        <ul className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
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
