// 📁 src/pages/RegisterUser.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

const RegisterUser = () => {
  const [role, setRole] = useState("teacher");
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [teacherData, setTeacherData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    subject_specialization: "",
    employee_id: "",
    date_of_joining: "",
    status: "active",
  });

  const [studentData, setStudentData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    roll_number: "",
    student_class: "",
    date_of_birth: "",
    admission_date: "",
    status: "active",
    assigned_teacher: "",
  });

  useEffect(() => {
    if (role === "student") {
      setLoadingTeachers(true);
      axios
        .get("/teachers/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // ✅ Fix here: use `results` from paginated response
          setTeachers(res.data.results || []);
          setLoadingTeachers(false);
        })
        .catch((err) => {
          console.error("Error fetching teachers:", err);
          setLoadingTeachers(false);
        });
    }
  }, [role]);

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user: {
        username: teacherData.username,
        email: teacherData.email,
        first_name: teacherData.first_name,
        last_name: teacherData.last_name,
        phone: teacherData.phone,
      },
      phone: teacherData.phone,
      subject_specialization: teacherData.subject_specialization,
      employee_id: teacherData.employee_id,
      date_of_joining: teacherData.date_of_joining,
      status: teacherData.status,
    };

    try {
      await axios.post("/teachers/", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Teacher registered successfully");
    } catch (err) {
      console.error(err);
      alert("Error registering teacher");
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user: {
        username: studentData.username,
        email: studentData.email,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        phone: studentData.phone,
      },
      phone: studentData.phone,
      roll_number: studentData.roll_number,
      student_class: studentData.student_class,
      date_of_birth: studentData.date_of_birth,
      admission_date: studentData.admission_date,
      status: studentData.status,
      assigned_teacher: studentData.assigned_teacher,
    };

    try {
      await axios.post("/students/", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Student registered successfully");
    } catch (err) {
      console.error(err);
      alert("Error registering student");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Register New {role.charAt(0).toUpperCase() + role.slice(1)}
      </Typography>

      {/* Role Selector */}
      <TextField
        select
        fullWidth
        label="Select Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        margin="normal"
      >
        <MenuItem value="teacher">Teacher</MenuItem>
        <MenuItem value="student">Student</MenuItem>
      </TextField>

      {/* TEACHER FORM */}
      {role === "teacher" && (
        <form onSubmit={handleTeacherSubmit}>
          {Object.keys(teacherData).map((key) => (
            <TextField
              key={key}
              fullWidth
              label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              type={key.includes("date") ? "date" : "text"}
              value={teacherData[key]}
              onChange={(e) =>
                setTeacherData({ ...teacherData, [key]: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={key.includes("date") ? { shrink: true } : {}}
            />
          ))}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register Teacher
          </Button>
        </form>
      )}

      {/* STUDENT FORM */}
      {role === "student" && (
        <form onSubmit={handleStudentSubmit}>
          {Object.keys(studentData).map((key) => {
            if (key === "assigned_teacher") {
              return (
                <TextField
                  key={key}
                  select
                  fullWidth
                  label="Assigned Teacher"
                  value={studentData[key]}
                  onChange={(e) =>
                    setStudentData({ ...studentData, [key]: e.target.value })
                  }
                  margin="normal"
                  required
                >
                  {loadingTeachers ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <MenuItem value={teacher.id} key={teacher.id}>
                        {teacher.user?.first_name} {teacher.user?.last_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No teachers available</MenuItem>
                  )}
                </TextField>
              );
            } else {
              return (
                <TextField
                  key={key}
                  fullWidth
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  type={key.includes("date") ? "date" : "text"}
                  value={studentData[key]}
                  onChange={(e) =>
                    setStudentData({ ...studentData, [key]: e.target.value })
                  }
                  margin="normal"
                  required
                  InputLabelProps={key.includes("date") ? { shrink: true } : {}}
                />
              );
            }
          })}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register Student
          </Button>
        </form>
      )}
    </Box>
  );
};

export default RegisterUser;
