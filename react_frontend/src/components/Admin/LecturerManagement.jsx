// src/components/Admin/LecturerManagement.jsx

import { useState } from "react";
import useFetch from "../shared/useFetch";
import Table from "../shared/Table";
import Form from "../shared/Form";
import ConfirmDialog from "../shared/ConfirmDialog";
import api from "../api.jsx";

function LecturerManagement() {
  const { data: lecturers, isLoading, error } = useFetch("/lecturers/");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ id: null, staff_id: "", first_name: "", last_name: "" });
  const [isEditing, setIsEditing] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/lecturers/${deleteId}/`);
      setConfirmDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting lecturer:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: null, staff_id: "", first_name: "", last_name: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/lecturers/${formData.id}/`, formData);
      } else {
        await api.post("/lecturers/", formData);
      }
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error saving lecturer:", error);
    }
  };

  const handleEdit = (lecturer) => {
    setFormData({
      id: lecturer.id,
      staff_id: lecturer.staff_id,
      first_name: lecturer.user.first_name,
      last_name: lecturer.user.last_name,
    });
    setIsEditing(true);
  };

  const tableHeaders = ["Staff ID", "First Name", "Last Name", "Actions"];
  const tableData = lecturers?.map((lecturer) => ({
    id: lecturer.id,
    "Staff ID": lecturer.staff_id,
    "First Name": lecturer.user?.first_name || "N/A",
    "Last Name": lecturer.user?.last_name || "N/A",
    Actions: (
      <>
        <button
          className="btn btn-secondary btn-sm me-2"
          onClick={() => handleEdit(lecturer)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => confirmDelete(lecturer.id)}
        >
          Delete
        </button>
      </>
    ),
  }));

  const formFields = {
    staff_id: {
      label: "Staff ID",
      id: "staff_id",
      type: "text",
      value: formData.staff_id,
      onChange: (e) => setFormData({ ...formData, staff_id: e.target.value }),
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
  };

  return (
    <div className="container mt-4">
      <h1>Lecturer Management</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error loading data. Check console logs.</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <h2>{isEditing ? "Edit Lecturer" : "Add New Lecturer"}</h2>
              <Form
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                submitText={isEditing ? "Update" : "Save"}
                cancelText="Cancel"
              />
            </div>
            <div className="col-md-6">
              <h2>Lecturer List</h2>
              <Table headers={tableHeaders} data={tableData} />
            </div>
          </div>
        </>
      )}
      {confirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this lecturer?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialog(false)}
        />
      )}
    </div>
  );
}

export default LecturerManagement;
