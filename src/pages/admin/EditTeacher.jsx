import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    axios
      .get(`/teachers/${id}/`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error("Failed to load teacher data", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        user: { ...prev.user, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/teachers/${id}/`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Teacher updated!");
      navigate("/admin/dashboard/teachers");
    } catch (err) {
      if (err.response) {
        console.error("Update failed:", err.response.data);
        alert("Update failed: " + JSON.stringify(err.response.data));
      } else {
        console.error("Update failed:", err);
        alert("Update failed. Please try again.");
      }
    }
  };

  if (!form) return <Typography>Loading...</Typography>;

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Edit Teacher</Typography>
      <form onSubmit={handleSubmit}>

<TextField
  fullWidth
  label="First Name"
  name="user.first_name"
  value={form.user.first_name}
  onChange={handleChange}
  margin="normal"
/>

<TextField
  fullWidth
  label="Last Name"
  name="user.last_name"
  value={form.user.last_name}
  onChange={handleChange}
  margin="normal"
/>

<TextField
  fullWidth
  label="Username"
  name="user.username"
  value={form.user.username}
  onChange={handleChange}
  margin="normal"
/>

<TextField
  fullWidth
  label="Email"
  name="user.email"
  value={form.user.email}
  onChange={handleChange}
  margin="normal"
/>

        <TextField
          fullWidth
          label="Phone"
          name="user.phone"
          value={form.user.phone}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Subject"
          name="subject_specialization"
          value={form.subject_specialization}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Employee ID"
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Teacher
        </Button>
      </form>
    </Box>
  );
};

export default EditTeacher;
