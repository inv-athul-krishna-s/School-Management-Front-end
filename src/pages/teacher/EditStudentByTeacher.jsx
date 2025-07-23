import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditStudentByTeacher = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    axios
      .get(`/students/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const s = res.data;
        setFormData({
          username: s.user.username,
          email: s.user.email,
          first_name: s.user.first_name,
          last_name: s.user.last_name,
          phone: s.phone,
          roll_number: s.roll_number,
          student_class: s.student_class,
          date_of_birth: s.date_of_birth,
          admission_date: s.admission_date,
          status: s.status,
        });
      })
      .catch((err) => {
        console.error("Error fetching student data", err);
      });
  }, [id, token]);

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
    };

    try {
      await axios.put(`/students/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student updated successfully.");
      navigate("/teacher/dashboard/students");
    } catch (error) {
      console.error("Error updating student", error);
      alert("Failed to update student.");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Edit Student
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
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditStudentByTeacher;
