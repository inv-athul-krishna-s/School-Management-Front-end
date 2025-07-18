import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { token } = useAuth();

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [upcomingExamCount, setUpcomingExamCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch students
      const studentRes = await axios.get("/students/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const countStudents =
        studentRes.data.count ||
        studentRes.data.results?.length ||
        studentRes.data.length ||
        0;
      setStudentCount(countStudents);

      // Fetch teachers
      const teacherRes = await axios.get("/teachers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const countTeachers =
        teacherRes.data.count ||
        teacherRes.data.results?.length ||
        teacherRes.data.length ||
        0;
      setTeacherCount(countTeachers);

      // Fetch exams
      const examRes = await axios.get("/exams/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allExams =
        examRes.data.results || examRes.data || [];

      const today = new Date();

      const upcomingExams = allExams.filter((exam) => {
        const examDate = new Date(exam.date);
        return examDate > today;
      });

      setUpcomingExamCount(upcomingExams.length);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📊 Admin Dashboard</h2>
      <div className="row">
        {/* Students Card */}
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h5 className="card-title">Total Students</h5>
              <p className="card-text fs-2">{studentCount}</p>
            </div>
          </div>
        </div>

        {/* Teachers Card */}
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Total Teachers</h5>
              <p className="card-text fs-2">{teacherCount}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Exams Card */}
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Upcoming Exams</h5>
              <p className="card-text fs-2">{upcomingExamCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
