// src/components/Navigation/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuthDispatch, useAuthState } from './AuthContext';
import api from "../api";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const { isAuthenticated, userRole } = useAuthState();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'LOGOUT' });
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
                <Link className="nav-link" to="/admin/dashboard">
                  Dashboard
                </Link>
              </li>
              {userRole === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/courses">
                      Courses
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/classes">
                      Classes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/lecturers">
                      Lecturers
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/students">
                      Students
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/semesters">
                      Semesters
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/check-attendance">
                      Check Attendance
                    </Link>
                  </li>
                </>
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
              <button className="btn btn-link nav-link" disabled>
                Login
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
