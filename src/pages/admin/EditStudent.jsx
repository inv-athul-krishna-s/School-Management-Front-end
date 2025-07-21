// src/pages/admin/EditStudent.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios"; 


const EditStudent = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/students/${id}/`).then((res) => setForm(res.data));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/students/${id}/`, form).then(() => {
      alert("Student updated!");
      navigate("/admin/dashboard/students");
    });
  };

  if (!form) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Student</h2>
      <input name="user.first_name" value={form.user.first_name} onChange={handleChange} placeholder="First Name" />
      <input name="user.last_name" value={form.user.last_name} onChange={handleChange} placeholder="Last Name" />
      <input name="roll_number" value={form.roll_number} onChange={handleChange} placeholder="Roll Number" />
      <input name="student_class" value={form.student_class} onChange={handleChange} placeholder="Class" />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditStudent;
