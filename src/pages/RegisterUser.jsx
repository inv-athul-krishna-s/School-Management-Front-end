import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const RegisterUser = () => {
  const { accessToken } = useAuth();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    roll_number: "",
    student_class: "",
    date_of_birth: "",
    admission_date: "",
    subject_specialization: "",
    employee_id: "",
    date_of_joining: "",
    assigned_teacher: "",
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (role === "student") {
      axios.get("http://localhost:8000/api/teachers/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((res) => setTeachers(res.data)).catch(console.error);
    }
  }, [role, accessToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: {
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      },
      phone: form.phone,
      status: "active",
    };

    if (role === "student") {
      Object.assign(payload, {
        roll_number: form.roll_number,
        student_class: form.student_class,
        date_of_birth: form.date_of_birth,
        admission_date: form.admission_date,
        assigned_teacher: form.assigned_teacher,
      });
    } else {
      Object.assign(payload, {
        subject_specialization: form.subject_specialization,
        employee_id: form.employee_id,
        date_of_joining: form.date_of_joining,
      });
    }

    try {
      const endpoint = role === "student" ? "/api/students/" : "/api/teachers/";
      await axios.post(`http://localhost:8000${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert(`${role} registered successfully`);
    } catch (err) {
      console.error(err);
      alert("Registration failed. Check console for details.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Register New {role === "teacher" ? "Teacher" : "Student"}</h3>
      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <input name="first_name" placeholder="First Name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input name="last_name" placeholder="Last Name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input name="username" placeholder="Username" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input name="email" type="email" placeholder="Email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input name="password" type="password" placeholder="Password" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input name="phone" placeholder="Phone" className="form-control" onChange={handleChange} required />
          </div>

          {role === "student" ? (
            <>
              <div className="col-md-6">
                <input name="roll_number" placeholder="Roll Number" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="student_class" placeholder="Class" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="date_of_birth" type="date" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="admission_date" type="date" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <select name="assigned_teacher" className="form-select" onChange={handleChange}>
                  <option value="">Assign Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.user.username}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-6">
                <input name="employee_id" placeholder="Employee ID" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="subject_specialization" placeholder="Subject Specialization" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input name="date_of_joining" type="date" className="form-control" onChange={handleChange} />
              </div>
            </>
          )}
        </div>

        <button className="btn btn-success mt-4">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
