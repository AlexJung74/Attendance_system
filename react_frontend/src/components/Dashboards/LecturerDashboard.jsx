// src/components/Dashboards/LecturerDashboard.jsx

import { useEffect, useState } from 'react';
import api from '../api.jsx';

function LecturerDashboard() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/lecturer/classes/');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching lecturer classes:', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Lecturer Dashboard</h1>
      <h2>Your Classes</h2>
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Class Number</th>
            <th>Course</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <tr key={classItem.id}>
                <td>{classItem.number}</td>
                <td>{classItem.course.name}</td>
                <td>{classItem.semester.year} {classItem.semester.semester}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => window.location.href = `/attendance-check/${classItem.id}`}
                  >
                    Check Attendance
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No classes available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LecturerDashboard;
