// src/components/Dashboards/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.jsx';

function AdminDashboard() {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loadingSemesters, setLoadingSemesters] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const semestersResponse = await api.get('/semesters/');
        console.log('Semesters API response:', semestersResponse.data);
        const semestersData = semestersResponse.data.results || semestersResponse.data;
        setSemesters(semestersData);
      } catch (error) {
        console.error('Error fetching semesters:', error);
        setSemesters([]);
      } finally {
        setLoadingSemesters(false);
      }
    };

    fetchData();
  }, []);

  // 학기가 변경되었을 때 강좌 가져오기
  useEffect(() => {
    const fetchCourses = async () => {
      if (selectedSemester) {
        setLoadingCourses(true);
        try {
          const response = await api.get(`/courses/?semester=${selectedSemester}`);
          const coursesData = response.data.results || response.data;
          setCourses(coursesData);
        } catch (error) {
          console.error('Error fetching courses:', error);
          setCourses([]);
        } finally {
          setLoadingCourses(false);
        }
      } else {
        setCourses([]);
        setClasses([]);
      }
    };

    fetchCourses();
  }, [selectedSemester]);

  // 강좌가 변경되었을 때 수업 가져오기
  useEffect(() => {
    console.log("[useEffect] Triggered. selectedSemester:", selectedSemester, "selectedCourse:", selectedCourse);
    const fetchClasses = async () => {
      console.log("fetchClasses start");
      if (selectedSemester && selectedCourse) {
        console.log("[fetchClasses] set loading classes");
        setLoadingClasses(true);
        try {
          console.log("[fetchClasses] try");
          const response = await api.get(
            `/classes/?semester=${selectedSemester}&course=${selectedCourse}`
          );
          console.log("Classes API Response:", response.data);
          const classesData = response.data.results || response.data;
          console.log("Classes Data:", classesData);
          setClasses(classesData);
        } catch (error) {
          console.error('Error fetching classes:', error);
          setClasses([]);
        } finally {
          setLoadingClasses(false);
        }
      } else {
        setClasses([]);
      }
    };

    if (selectedSemester && selectedCourse) {
      console.log("Fetching classes for semester:", selectedSemester, "and course:", selectedCourse);
      fetchClasses();
    } else {
      setClasses([]); // 필터링되지 않은 상태를 명확히 하기 위해 초기화
      console.log("Semester or course not selected");
    }
  }, [selectedSemester, selectedCourse]);

  // 체크 버튼 핸들러
  const handleCheckAttendance = () => {
    if (selectedSemester && selectedCourse && selectedClass) {
      navigate(`/attendance-check/${selectedClass}`);
    } else {
      alert('Please select all fields.');
    }
  };

  // 리셋 버튼 핸들러
  const handleReset = () => {
    setSelectedSemester('');
    setSelectedCourse('');
    setSelectedClass('');
    setCourses([]);
    setClasses([]);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard!</p>
      <div className="admin-buttons mb-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/admin/semesters')}
        >
          Manage Semesters
        </button>
        <button
          className="btn btn-success btn-lg"
          onClick={() => navigate('/admin/courses')}
        >
          Manage Courses
        </button>
        <button
          className="btn btn-info btn-lg"
          onClick={() => navigate('/admin/classes')}
        >
          Manage Classes
        </button>
        <button
          className="btn btn-warning btn-lg"
          onClick={() => navigate('/admin/lecturers')}
        >
          Manage Lecturers
        </button>
        <button
          className="btn btn-danger btn-lg"
          onClick={() => navigate('/admin/students')}
        >
          Manage Students
        </button>
      </div>

      {/* Check Attendance Section */}
      <div className="card mt-4">
        <div className="card-header">Check Attendance</div>
        <div className="card-body">
          <div className="form-group mb-3">
            <label htmlFor="semester">Select Semester:</label>
            {loadingSemesters ? (
              <p>Loading semesters...</p>
            ) : (
              <select
                id="semester"
                className="form-control"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">-- Select Semester --</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.year} {semester.semester}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="course">Select Course:</label>
            {loadingCourses ? (
              <p>Loading courses...</p>
            ) : (
              <select
                id="course"
                className="form-control"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={!selectedSemester}
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="class">Select Class:</label>
            {loadingClasses ? (
              <p>Loading classes...</p>
            ) : (
              <select
                id="class"
                className="form-control"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={!selectedCourse}
              >
                <option value="">-- Select Class --</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    Class {classItem.number}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-actions">
            <button
              className="btn btn-primary me-2"
              onClick={handleCheckAttendance}
            >
              Check Attendance
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
