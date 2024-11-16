// src/components/Dashboards/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminDashboard() {
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get("/admin/dashboard/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLecturers(response.data.lecturers || []);
      setCourses(response.data.courses || []);
      setClasses(response.data.classes || []);
      setSemesters(response.data.semesters || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard!</p>
      <div className="admin-buttons mb-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/admin/semesters")}
        >
          Manage Semesters
        </button>
        <button
          className="btn btn-success btn-lg"
          onClick={() => navigate("/admin/courses")}
        >
          Manage Courses
        </button>
        <button
          className="btn btn-info btn-lg"
          onClick={() => navigate("/admin/classes")}
        >
          Manage Classes
        </button>
        <button
          className="btn btn-warning btn-lg"
          onClick={() => navigate("/admin/lecturers")}
        >
          Manage Lecturers
        </button>
        <button
          className="btn btn-danger btn-lg"
          onClick={() => navigate("/admin/students")}
        >
          Manage Students
        </button>
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => navigate("/admin/upload-students")}
        >
          Upload Student Info
        </button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3>Courses</h3>
          <ul className="list-group">
            {courses.map((course) => (
              <li key={course.id} className="list-group-item">
                {course.name} ({course.code})
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h3>Lecturers</h3>
          <ul className="list-group">
            {lecturers.map((lecturer) => (
              <li key={lecturer.id} className="list-group-item">
                {lecturer.user.first_name} {lecturer.user.last_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
