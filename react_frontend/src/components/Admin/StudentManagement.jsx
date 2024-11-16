import { useState, useEffect, useCallback } from "react";
import api from "../api.jsx";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    studentId: "",
    DOB: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null); // 에러 메시지 저장

  // 학생 목록 가져오기
  const fetchStudents = useCallback(async () => {
    try {
      const response = await api.get("/students/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      id: null,
      username: "",
      studentId: "",
      DOB: "",
    });
    setIsEditing(false);
    setError(null);
  };

  // 학생 추가/편집
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(
          `/students/${formData.id}/`,
          {
            username: formData.username,
            studentId: formData.studentId,
            DOB: formData.DOB,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );
      } else {
        await api.post(
          "/students/",
          {
            username: formData.username,
            studentId: formData.studentId,
            DOB: formData.DOB,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );
      }
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error("Error saving student:", error);
      setError("Failed to save student. Please check the details and try again.");
    }
  };

  // 학생 삭제
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        setError("Failed to delete student. Please try again later.");
      }
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("student_file", file);
    try {
      await api.post("/students/upload/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully.");
      fetchStudents();
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please ensure it's a valid Excel file.");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Student Management</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Form Section */}
        <div className="col-md-6">
          <h2>{isEditing ? "Edit Student" : "Add New Student"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="studentId" className="form-label">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                className="form-control"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="DOB" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="DOB"
                className="form-control"
                value={formData.DOB}
                onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update" : "Save"}
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
              Cancel
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="col-md-6">
          <h2>Student List</h2>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Student ID</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.username}</td>
                  <td>{student.studentId}</td>
                  <td>{student.DOB}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() =>
                        setFormData({
                          id: student.id,
                          username: student.username,
                          studentId: student.studentId,
                          DOB: student.DOB,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!students.length && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No students available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* File Upload Section */}
        <div className="col-md-12 mt-4">
          <h2>Upload Students via Excel</h2>
          <form onSubmit={handleFileUpload}>
            <div className="mb-3">
              <label htmlFor="studentFile" className="form-label">
                Select Excel File
              </label>
              <input
                type="file"
                id="studentFile"
                className="form-control"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentManagement;
