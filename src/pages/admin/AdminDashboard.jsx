import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Box, Typography, Grid, Paper, Avatar } from "@mui/material";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");

      try {
        const studentRes = await axios.get("/students/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const students = studentRes.data.students;
        if (Array.isArray(students)) {
          setStudentCount(students.length);
        }
      } catch (err) {
        console.error("Failed to fetch student count", err);
      }

      try {
        const teacherRes = await axios.get("/teachers/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const teachers = teacherRes.data.teachers || teacherRes.data; // adjust depending on API
        if (Array.isArray(teachers)) {
          setTeacherCount(teachers.length);
        }
      } catch (err) {
        console.error("Failed to fetch teacher count", err);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Total Students",
      count: studentCount,
      icon: <FaUserGraduate size={32} />,
      bgColor: "#1976d2",
    },
    {
      title: "Total Teachers",
      count: teacherCount,
      icon: <FaChalkboardTeacher size={32} />,
      bgColor: "#2e7d32",
    },
    {
      title: "Upcoming Exams",
      count: 0,
      icon: <FaCalendarAlt size={32} />,
      bgColor: "#ed6c02",
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: card.bgColor,
                color: "#fff",
              }}
              elevation={3}
            >
              <Avatar sx={{ bgcolor: "transparent" }}>{card.icon}</Avatar>
              <Box>
                <Typography variant="subtitle1">{card.title}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {card.count}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
