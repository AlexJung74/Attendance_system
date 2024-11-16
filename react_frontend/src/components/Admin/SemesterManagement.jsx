import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.jsx';

function SemesterManagement() {
  const [semesters, setSemesters] = useState([]);
  const [formData, setFormData] = useState({ year: '', semester: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
    // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // 학기 목록 가져오기
  const fetchSemesters = async () => {
    try {
      const response = await api.get('/semesters/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 폼 제출 핸들러 (생성 또는 수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/semesters/${editId}/`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      } else {
        await api.post('/semesters/', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      }
      setFormData({ year: '', semester: '' }); // 폼 초기화
      setIsEditing(false);
      setEditId(null);
      fetchSemesters(); // 목록 갱신
    } catch (error) {
      console.error('Error saving semester:', error);
    }
  };

  // 수정 모드 활성화
  const handleEdit = (semester) => {
    setFormData({ year: semester.year, semester: semester.semester });
    setIsEditing(true);
    setEditId(semester.id);
  };

  // 삭제 핸들러
  const handleDelete = async (id) => {
    try {
      await api.delete(`/semesters/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      fetchSemesters(); // 목록 갱신
    } catch (error) {
      console.error('Error deleting semester:', error);
    }
  };

  return (
    <div className="container">
      <h2>Semester Management</h2>

      {/* 리스트 */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Year</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {semesters.length > 0 ? (
            semesters.map((semester) => (
              <tr key={semester.id}>
                <td>{semester.year}</td>
                <td>{semester.semester}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => handleEdit(semester)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(semester.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No semesters available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 폼 */}
      <h3>{isEditing ? 'Edit Semester' : 'Add Semester'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="year" className="form-label">
            Year
          </label>
          <input
            type="number"
            className="form-control"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="semester" className="form-label">
            Semester
          </label>
          <select
            className="form-control"
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Semester --</option>
            <option value="Sem1">Semester 1</option>
            <option value="Sem2">Semester 2</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">
          {isEditing ? 'Update' : 'Save'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setFormData({ year: '', semester: '' });
              setIsEditing(false);
              setEditId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default SemesterManagement;
