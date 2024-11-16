import { useEffect, useState } from 'react';
import api from '../api.jsx'; // API 호출 유틸리티
import { useNavigate } from 'react-router-dom';

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    number: '',
    course: '',
    semester: '',
    lecturer: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [lecturers, setLecturers] = useState([]);
    // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // 수업 리스트 가져오기
  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // 선택 리스트 가져오기
  const fetchDropdownData = async () => {
    try {
      const [coursesRes, semestersRes, lecturersRes] = await Promise.all([
        api.get('/courses/'),
        api.get('/semesters/'),
        api.get('/lecturers/'),
      ]);
      setCourses(coursesRes.data);
      setSemesters(semestersRes.data);
      setLecturers(lecturersRes.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // 폼 데이터 초기화
  const resetForm = () => {
    setFormData({
      id: null,
      number: '',
      course: '',
      semester: '',
      lecturer: '',
    });
    setIsEditing(false);
  };

  // 수업 생성/업데이트 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/classes/${formData.id}/`, formData);
      } else {
        await api.post('/classes/', formData);
      }
      fetchClasses();
      resetForm();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  // 수업 편집 핸들러
  const handleEdit = (classInstance) => {
    setFormData({
      id: classInstance.id,
      number: classInstance.number,
      course: classInstance.course.id,
      semester: classInstance.semester.id,
      lecturer: classInstance.lecturer.id,
    });
    setIsEditing(true);
  };

  // 수업 삭제 핸들러
  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${classId}/`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchClasses();
    fetchDropdownData();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Class Management</h1>
      <div className="row">
        <div className="col-md-6">
          <h2>{isEditing ? 'Edit Class' : 'Add New Class'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="number" className="form-label">Class Number</label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="course" className="form-label">Course</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="form-control"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="semester" className="form-label">Semester</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="form-control"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>{semester.year} {semester.semester}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="lecturer" className="form-label">Lecturer</label>
              <select
                id="lecturer"
                name="lecturer"
                value={formData.lecturer}
                onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                className="form-control"
                required
              >
                <option value="">Select Lecturer</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Save'}</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel</button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Class List</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Number</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Lecturer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classInstance) => (
                <tr key={classInstance.id}>
                  <td>{classInstance.number}</td>
                  <td>{classInstance.course.name}</td>
                  <td>{classInstance.semester.year} {classInstance.semester.semester}</td>
                  <td>{classInstance.lecturer.name}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => handleEdit(classInstance)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(classInstance.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!classes.length && (
                <tr>
                  <td colSpan="5" className="text-center">No classes available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClassManagement;
