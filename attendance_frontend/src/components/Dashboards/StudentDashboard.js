// src/components/Student/StudentDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        axios.get('/api/student/attendance/', { headers: { Authorization: `Token ${localStorage.getItem('token')}` } })
            .then(response => setAttendance(response.data))
            .catch(error => console.error('Error fetching attendance:', error));
    }, []);

    return (
        <div>
            <h1>My Attendance</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Class</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map(record => (
                        <tr key={record.id}>
                            <td>{record.date}</td>
                            <td>{record.class_instance.course.name}</td>
                            <td>{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentDashboard;
