import { useState } from "react";
import useFetch from "../shared/useFetch";
import Table from "../shared/Table";
import Form from "../shared/Form";
import ConfirmDialog from "../shared/ConfirmDialog";
import api from "../api.jsx";

function StudentManagement() {
  const { data: students, isLoading, error } = useFetch("/students/");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${deleteId}/`);
      setConfirmDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      student_id: "",
      first_name: "",
      last_name: "",
      email: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/students/${formData.id}/`, formData);
      } else {
        await api.post("/students/", formData);
      }
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      id: student.id,
      student_id: student.student_id,
      first_name: student.user?.first_name || "",
      last_name: student.user?.last_name || "",
      email: student.user?.email || "",
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/students/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess(response.data.message || "Students uploaded successfully.");
      setUploadError(null);
      window.location.reload(); // Reload to fetch updated students list
    } catch (error) {
      console.error("Error uploading students:", error);
      setUploadSuccess(null);
      setUploadError("Failed to upload students. Please check the file format.");
    }
  };

  const tableHeaders = ["Student ID", "First Name", "Last Name", "Email", "Actions"];
  const tableData = students?.map((student) => ({
    id: student.id,
    "Student ID": student.student_id,
    "First Name": student.user?.first_name || "N/A",
    "Last Name": student.user?.last_name || "N/A",
    Email: student.user?.email || "N/A",
    Actions: (
      <>
        <button
          className="btn btn-secondary btn-sm me-2"
          onClick={() => handleEdit(student)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => confirmDelete(student.id)}
        >
          Delete
        </button>
      </>
    ),
  }));

  const formFields = {
    student_id: {
      label: "Student ID",
      id: "student_id",
      type: "text",
      value: formData.student_id,
      onChange: (e) => setFormData({ ...formData, student_id: e.target.value }),
      required: true,
    },
    first_name: {
      label: "First Name",
      id: "first_name",
      type: "text",
      value: formData.first_name,
      onChange: (e) => setFormData({ ...formData, first_name: e.target.value }),
      required: true,
    },
    last_name: {
      label: "Last Name",
      id: "last_name",
      type: "text",
      value: formData.last_name,
      onChange: (e) => setFormData({ ...formData, last_name: e.target.value }),
      required: true,
    },
    email: {
      label: "Email",
      id: "email",
      type: "email",
      value: formData.email,
      onChange: (e) => setFormData({ ...formData, email: e.target.value }),
      required: true,
    },
  };

  return (
    <div className="container mt-4">
      <h1>Student Management</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error loading data. Check console logs.</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <h2>{isEditing ? "Edit Student" : "Add New Student"}</h2>
              <Form
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                submitText={isEditing ? "Update" : "Save"}
                cancelText="Cancel"
              />
            </div>
            <div className="col-md-6">
              <h2>Student List</h2>
              <Table headers={tableHeaders} data={tableData} />
              <h4>Upload Students</h4>
              <input type="file" onChange={handleFileUpload} />
              {uploadError && <p className="text-danger">{uploadError}</p>}
              {uploadSuccess && <p className="text-success">{uploadSuccess}</p>}
            </div>
          </div>
        </>
      )}
      {confirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this student?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialog(false)}
        />
      )}
    </div>
  );
}

export default StudentManagement;
