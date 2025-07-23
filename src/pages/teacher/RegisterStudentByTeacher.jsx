import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const RegisterStudentByTeacher = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    roll_number: "",
    student_class: "",
    date_of_birth: "",
    admission_date: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        password: formData.password,
      },
      phone: formData.phone,
      roll_number: formData.roll_number,
      student_class: formData.student_class,
      date_of_birth: formData.date_of_birth,
      admission_date: formData.admission_date,
      status: formData.status,
    };

    try {
      await axios.post("/students/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Student registered successfully");
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        roll_number: "",
        student_class: "",
        date_of_birth: "",
        admission_date: "",
        status: "active",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to register student");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        🧑‍🎓 Register New Student
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth margin="normal" required />
        <TextField label="Roll Number" name="roll_number" value={formData.roll_number} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Class" name="student_class" value={formData.student_class} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField label="Admission Date" name="admission_date" type="date" value={formData.admission_date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register Student
        </Button>
      </form>
    </Box>
  );
};

export default RegisterStudentByTeacher;
