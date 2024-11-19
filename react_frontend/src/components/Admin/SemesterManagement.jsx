// src/components/Admin/SemesterManagement.jsx

import { useState } from "react";
import useFetch from "../Shared/useFetch.jsx";
import ConfirmDialog from "../Shared/ConfirmDialog.jsx";
import api from "../api.jsx";

function SemesterManagement() {
  const {
    data: semesters,
    isLoading,
    error,
  } = useFetch("/semesters/");

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ id: null, year: "", semester: "" });
  const [isEditing, setIsEditing] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/semesters/${deleteId}/`);
      setConfirmDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting semester:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: null, year: "", semester: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/semesters/${formData.id}/`, formData);
      } else {
        await api.post("/semesters/", formData);
      }
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error saving semester:", error);
    }
  };

  const handleEdit = (semester) => {
    setFormData({ id: semester.id, year: semester.year, semester: semester.semester });
    setIsEditing(true);
  };

  return (
    <div className="container mt-4">
      <h1>Semester Management</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error loading data. Check console logs.</p>
      ) : (
        <div className="row">
          {/* Form Section */}
          <div className="col-md-6">
            <h2>{isEditing ? "Edit Semester" : "Add New Semester"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="year" className="form-label">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="form-control"
                  required
                />
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
                  <option value="">-- Select Semester --</option>
                  <option value="Sem1">Semester 1</option>
                  <option value="Sem2">Semester 2</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                {isEditing ? "Update" : "Save"}
              </button>
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="col-md-6">
            <h2>Semester List</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {semesters?.map((semester) => (
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
                        onClick={() => confirmDelete(semester.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(!semesters || semesters.length === 0) && (
                  <tr>
                    <td colSpan="3" className="text-center">No semesters available</td>
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
          message="Are you sure you want to delete this semester?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialog(false)}
        />
      )}
    </div>
  );
}

export default SemesterManagement;
