// src/components/Admin/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import api from '../api';  // axios 인스턴스

function AdminDashboard() {
    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses/');
            setCourses(response.data);  // response.data.courses 대신 response.data로 설정
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>{course.name} - {course.code}</li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
