import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const RegisterStudentByTeacher = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      user: {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      },
      phone: formData.phone,
      roll_number: formData.roll_number,
      student_class: formData.student_class,
      date_of_birth: formData.date_of_birth,
      admission_date: formData.admission_date,
      status: formData.status,
      assigned_teacher: user.id,
    };

    try {
      await axios.post("/students/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student registered successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to register student");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Register New Student
      </Typography>

      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <TextField
            key={key}
            fullWidth
            label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            type={key.includes("date") ? "date" : "text"}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={key.includes("date") ? { shrink: true } : {}}
          />
        ))}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register Student
        </Button>
      </form>
    </Box>
  );
};

export default RegisterStudentByTeacher;
