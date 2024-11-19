import { useState } from "react";
import useFetch from "../Shared/useFetch.jsx";
import Table from "../Shared/Table.jsx";
import Form from "../Shared/Form.jsx";
import ConfirmDialog from "../Shared/ConfirmDialog.jsx";
import api from "../api.jsx";

function CourseManagement() {
  const { data: courses, isLoading, error } = useFetch("/courses/");
  console.log("[CourseManagement] Fetched courses data:", courses); // courses 데이터 확인

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ id: null, code: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${deleteId}/`);
      setConfirmDialog(false);
      window.location.reload(); // Reload to fetch updated courses list
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: null, code: "", name: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/courses/${formData.id}/`, formData);
      } else {
        await api.post("/courses/", formData);
      }
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEdit = (course) => {
    setFormData({ id: course.id, code: course.code, name: course.name });
    setIsEditing(true);
  };

  const tableHeaders = ["Code", "Name", "Actions"];
  const tableData = courses?.map((course) => ({
    id: course.id,
    Code: course.code,
    Name: course.name,
    Actions: (
      <>
        <button
          className="btn btn-secondary btn-sm me-2"
          onClick={() => handleEdit(course)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => confirmDelete(course.id)}
        >
          Delete
        </button>
      </>
    ),
  }));

  console.log("[CourseManagement] Table data:", tableData); // 테이블 데이터 확인

  const formFields = {
    code: {
      label: "Course Code",
      id: "code",
      type: "text",
      value: formData.code,
      onChange: (e) => setFormData({ ...formData, code: e.target.value }),
      required: true,
    },
    name: {
      label: "Course Name",
      id: "name",
      type: "text",
      value: formData.name,
      onChange: (e) => setFormData({ ...formData, name: e.target.value }),
      required: true,
    },
  };

  return (
    <div className="container mt-4">
      <h1>Course Management</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error loading data. Check console logs.</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <h2>{isEditing ? "Edit Course" : "Add New Course"}</h2>
              <Form
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                submitText={isEditing ? "Update" : "Save"}
                cancelText="Cancel"
              />
            </div>
            <div className="col-md-6">
              <h2>Course List</h2>
              <Table headers={tableHeaders} data={tableData} />
            </div>
          </div>
        </>
      )}
      {confirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this course?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialog(false)}
        />
      )}
    </div>
  );
}

export default CourseManagement;
