import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.jsx';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ id: null, code: '', name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // 코스 목록 가져오기
  const fetchCourses = useCallback(async () => {
    try {
      const response = await api.get('/courses/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.response && error.response.status === 401) {
        navigate('/'); // 인증 실패 시 로그인 페이지로 리디렉션
      }
    }
  }, [navigate]);

  // 폼 데이터 초기화
  const resetForm = () => {
    setFormData({ id: null, code: '', name: '' });
    setIsEditing(false);
  };

  // 코스 생성/업데이트 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/courses/${formData.id}/`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      } else {
        await api.post('/courses/', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  // 코스 수정 핸들러
  const handleEdit = (course) => {
    setFormData({ id: course.id, code: course.code, name: course.name });
    setIsEditing(true);
  };

  // 코스 삭제 핸들러
  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  // 컴포넌트가 처음 렌더링될 때 코스 데이터를 가져옴
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="container mt-4">
      <h1>Course Management</h1>
      <div className="row">
        {/* Course Form Section */}
        <div className="col-md-6">
          <h2>{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="code" className="form-label">Course Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Course Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Save'}</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel</button>
          </form>
        </div>

        {/* Course List Section */}
        <div className="col-md-6">
          <h2>Course List</h2>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => handleEdit(course)}
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
              ))}
              {!courses.length && (
                <tr>
                  <td colSpan="3" className="text-center">No courses available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseManagement;
