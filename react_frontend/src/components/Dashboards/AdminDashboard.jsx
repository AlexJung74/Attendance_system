// src/components/Dashboards/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import api from '../api';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await api.get('/courses/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCourses(response.data);
      console.log("Courses fetched successfully:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn('401 Unauthorized: Redirecting to login');
        // 필요한 경우 리다이렉션 로직 추가
      }
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
