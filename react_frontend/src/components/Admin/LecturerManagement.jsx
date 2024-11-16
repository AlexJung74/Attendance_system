import { useState, useEffect, useCallback } from 'react';
import api from '../api.jsx';

function LecturerManagement() {
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    staffId: '',
    DOB: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // 강사 목록 가져오기
  const fetchLecturers = useCallback(async () => {
    try {
      const response = await api.get('/lecturers/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setLecturers(response.data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  }, []);

  useEffect(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  // 폼 데이터 초기화
  const resetForm = () => {
    setFormData({
      id: null,
      fullName: '',
      staffId: '',
      DOB: '',
    });
    setIsEditing(false);
  };

  // 강사 추가/편집
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/lecturers/${formData.id}/`, {
          fullName: formData.fullName,
          staffId: formData.staffId,
          DOB: formData.DOB,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      } else {
        await api.post('/lecturers/', {
          fullName: formData.fullName,
          staffId: formData.staffId,
          DOB: formData.DOB,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      }
      fetchLecturers();
      resetForm();
    } catch (error) {
      console.error('Error saving lecturer:', error);
    }
  };

  // 강사 편집
  const handleEdit = (lecturer) => {
    setFormData({
      id: lecturer.id,
      fullName: lecturer.fullName,
      staffId: lecturer.staffId,
      DOB: lecturer.DOB,
    });
    setIsEditing(true);
  };

  // 강사 삭제
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await api.delete(`/lecturers/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        fetchLecturers();
      } catch (error) {
        console.error('Error deleting lecturer:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Lecturer Management</h1>

      <div className="row">
        {/* Form Section */}
        <div className="col-md-6">
          <h2>{isEditing ? 'Edit Lecturer' : 'Add New Lecturer'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="staffId" className="form-label">Staff ID</label>
              <input
                type="text"
                id="staffId"
                className="form-control"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="DOB" className="form-label">Date of Birth</label>
              <input
                type="date"
                id="DOB"
                className="form-control"
                value={formData.DOB}
                onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Save'}</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel</button>
          </form>
        </div>

        {/* List Section */}
        <div className="col-md-6">
          <h2>Lecturer List</h2>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Staff ID</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map((lecturer) => (
                <tr key={lecturer.id}>
                  <td>{lecturer.fullName}</td>
                  <td>{lecturer.staffId}</td>
                  <td>{lecturer.DOB}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => handleEdit(lecturer)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(lecturer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!lecturers.length && (
                <tr>
                  <td colSpan="4" className="text-center">No lecturers available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LecturerManagement;
