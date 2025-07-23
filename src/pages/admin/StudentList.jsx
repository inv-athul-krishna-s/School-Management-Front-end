import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/students/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err.response?.data || err.message);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Students List</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/dashboard/register")}
        >
          ➕ Register Student
        </button>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Roll No</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.roll_number}</td>
                <td>{`${student.user.first_name} ${student.user.last_name}`}</td>
                <td>{student.user.email}</td>
                <td>{student.student_class}</td>
                <td>{student.user.phone || student.phone}</td> {/* Updated field */}
                 <td>
          <button
            className="btn btn-sm btn-warning"
            onClick={() =>
              navigate(`/admin/dashboard/edit-student/${student.id}`)
            }
          >
            ✏️ Edit
          </button>
            <button
    className="btn btn-sm btn-danger"
    onClick={() => handleDelete(student.id)}
  >
    🗑️ Delete
  </button>
        </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
