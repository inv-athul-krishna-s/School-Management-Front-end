import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { token } = useAuth();

  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch students
      const studentRes = await axios.get("/students/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentCount(
        studentRes.data.count ||
          studentRes.data.results?.length ||
          studentRes.data.length ||
          0
      );

      // Fetch teachers
      const teacherRes = await axios.get("/teachers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeacherCount(
        teacherRes.data.count ||
          teacherRes.data.results?.length ||
          teacherRes.data.length ||
          0
      );
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  return (
    <div className="px-3 py-4">
      <h2 className="mb-4 text-center fw-bold">📊 Admin Dashboard</h2>

      <div className="d-grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {/* Students Card */}
        <div className="card text-white bg-primary shadow rounded-3">
          <div className="card-body text-center">
            <h5 className="card-title">Total Students</h5>
            <p className="card-text fs-1 fw-bold">{studentCount}</p>
          </div>
        </div>

        {/* Teachers Card */}
        <div className="card text-white bg-success shadow rounded-3">
          <div className="card-body text-center">
            <h5 className="card-title">Total Teachers</h5>
            <p className="card-text fs-1 fw-bold">{teacherCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
