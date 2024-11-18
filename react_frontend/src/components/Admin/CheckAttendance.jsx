// src/components/Admin/CheckAttendance.jsx

import { useState, useEffect } from 'react';
import api from '../api.jsx';
import Table from '../shared/Table';

function CheckAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/attendance/');
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Check Attendance</h1>
      <Table
        headers={['Date', 'Class', 'Student', 'Status']}
        data={attendanceData.map((record) => ({
          Date: record.date,
          Class: record.class,
          Student: record.student,
          Status: record.status,
        }))}
      />
    </div>
  );
}

export default CheckAttendance;
