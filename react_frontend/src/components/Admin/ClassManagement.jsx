// src/components/Admin/ClassManagement.jsx

import { useState } from "react";
import useFetch from "../shared/useFetch";
import ConfirmDialog from "../shared/ConfirmDialog";
import api from "../api.jsx";

function ClassManagement() {
  const {
    data: classes,
    isLoading: isClassesLoading,
    error: classesError,
  } = useFetch('/classes/');
  const {
    data: courses,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useFetch('/courses/');
  const {
    data: semesters,
    isLoading: isSemestersLoading,
    error: semestersError,
  } = useFetch('/semesters/');
  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useFetch('/lecturers/');

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    number: '',
    course: '',
    semester: '',
    lecturer: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/classes/${deleteId}/`);
      setConfirmDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/classes/${formData.id}/`, formData);
      } else {
        await api.post('/classes/', formData);
      }
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

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

  // 모든 로딩 상태와 에러 상태를 통합
  const isLoading =
    isClassesLoading ||
    isCoursesLoading ||
    isSemestersLoading ||
    isLecturersLoading;

  const error =
    classesError || coursesError || semestersError || lecturersError;

  return (
    <div className="container mt-4">
      <h1>Class Management</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error loading data. Check console logs.</p>
      ) : (
        // 데이터가 로드되었을 때의 UI 렌더링
        <div className="row">
          {/* 폼 섹션 */}
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
                  {courses?.map((course) => (
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
                  {semesters?.map((semester) => (
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
                  {lecturers?.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.user.first_name} {lecturer.user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update' : 'Save'}
              </button>
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>
          {/* 테이블 섹션 */}
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
                {classes?.map((classInstance) => (
                  <tr key={classInstance.id}>
                    <td>{classInstance.number}</td>
                    <td>{classInstance.course.name}</td>
                    <td>{classInstance.semester.year} {classInstance.semester.semester}</td>
                    <td>{classInstance.lecturer.user.first_name} {classInstance.lecturer.user.last_name}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm me-2"
                        onClick={() => handleEdit(classInstance)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => confirmDelete(classInstance.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(!classes || classes.length === 0) && (
                  <tr>
                    <td colSpan="5" className="text-center">No classes available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this class?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialog(false)}
        />
      )}
    </div>
  );
}

export default ClassManagement;
