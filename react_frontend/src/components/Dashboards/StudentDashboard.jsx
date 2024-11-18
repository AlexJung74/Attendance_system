// src/components/Dashboards/StudentDashboard.jsx

import { useEffect, useState } from 'react';
import api from '../api';

function StudentDashboard() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/student/attendance/');
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="container mt-4">
      <h1>My Attendance</h1>
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Date</th>
            <th>Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.length > 0 ? (
            attendanceRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>{record.class_instance.course.name}</td>
                <td>{record.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No attendance records available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
