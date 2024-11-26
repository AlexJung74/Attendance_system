// src/components/Lecturer/CourseList.jsx

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // 코스 목록을 가져오는 함수 (useCallback으로 래핑)
  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get(
    "https://attendance-backend-40491d7871de.herokuapp.com/api/classes/",
    { params: { semester: 2, course: 9 } }
      );
     // const response = await axios.get('/api/courses/', {
     //   headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
   //   });
      setCourses(response.data); // 코스 데이터 설정
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (error.response && error.response.status === 401) {
        navigate('/'); // 인증 실패 시 로그인 페이지로 리디렉션
      }
    }
  }, [navigate]); // navigate를 의존성으로 포함

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]); // fetchCourses를 의존성 배열에 추가

  // 코스를 삭제하는 함수
  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`/api/courses/${courseId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Course List</h2>
      <button className="btn btn-success mb-3" onClick={() => navigate('/admin/courses/create')}>
        Add New Course
      </button>
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No courses available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;
