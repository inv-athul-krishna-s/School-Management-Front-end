// src/pages/admin/EditStudent.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const EditStudent = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/students/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setForm(res.data));
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
    axios
      .patch(`/students/${id}/`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        alert("Student updated!");
        navigate("/admin/dashboard/students");
      })
      .catch((err) => {
        console.error("Update failed:", err.response?.data || err.message);
        alert("Failed to update student.");
      });
  };

  if (!form) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Edit Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="user.username"
                value={form.user.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="user.email"
                value={form.user.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="user.first_name"
                value={form.user.first_name}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="user.last_name"
                value={form.user.last_name}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="user.phone"
                value={form.user.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                className="form-control"
                name="roll_number"
                value={form.roll_number}
                onChange={handleChange}
                placeholder="Roll Number"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Class</label>
              <input
                type="text"
                className="form-control"
                name="student_class"
                value={form.student_class}
                onChange={handleChange}
                placeholder="Class"
              />
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/dashboard/students")}
            >
              ⬅ Back
            </button>

            <button type="submit" className="btn btn-primary">
              ✅ Update Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
