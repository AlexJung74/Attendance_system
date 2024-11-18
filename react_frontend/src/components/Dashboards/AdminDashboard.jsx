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
        {/* Courses Section */}
        <div className="col-md-6">
          <h3>Courses</h3>
          <ul className="list-group">
            {courses.length > 0 ? (
              courses.map((course) => (
                <li key={course.id} className="list-group-item">
                  {course.name || "N/A"} ({course.code || "N/A"})
                </li>
              ))
            ) : (
              <li className="list-group-item">No courses available.</li>
            )}
          </ul>
        </div>

        {/* Lecturers Section */}
        <div className="col-md-6">
          <h3>Lecturers</h3>
          <ul className="list-group">
            {lecturers.length > 0 ? (
              lecturers.map((lecturer) => (
                <li key={lecturer.id} className="list-group-item">
                  {lecturer.user?.first_name || "N/A"} {lecturer.user?.last_name || "N/A"}
                </li>
              ))
            ) : (
              <li className="list-group-item">No lecturers available.</li>
            )}
          </ul>
        </div>

        {/* Classes Section */}
        <div className="col-md-6">
          <h3>Classes</h3>
          <ul className="list-group">
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <li key={classItem.id} className="list-group-item">
                  {classItem.number || "N/A"} - {classItem.course?.name || "N/A"}
                </li>
              ))
            ) : (
              <li className="list-group-item">No classes available.</li>
            )}
          </ul>
        </div>

        {/* Semesters Section */}
        <div className="col-md-6">
          <h3>Semesters</h3>
          <ul className="list-group">
            {semesters.length > 0 ? (
              semesters.map((semester) => (
                <li key={semester.id} className="list-group-item">
                  {semester.year || "N/A"} - {semester.semester || "N/A"}
                </li>
              ))
            ) : (
              <li className="list-group-item">No semesters available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
