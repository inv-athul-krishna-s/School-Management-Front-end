import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10; // Match this with your backend's page size

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/students/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = res.data.results || [];
      setStudents(data);

      const total = res.data.count;
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/students/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStudents((prev) => prev.filter((student) => student.id !== id));
      alert("Student deleted successfully!");
      fetchStudents(); // Refresh list after deletion
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Failed to delete student.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get("/students-export/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "students_export.csv";
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch?.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err.response?.data || err.message);
      alert("Failed to export students.");
    }
  };

  const renderPagination = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..." // avoid multiple ellipses
      ) {
        pages.push("...");
      }
    }

    return (
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
            « Prev
          </button>
        </li>

        {pages.map((p, idx) =>
          p === "..." ? (
            <li key={`ellipsis-${idx}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(p)}>
                {p}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Next »
          </button>
        </li>
      </ul>
    );
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Students List</h2>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/admin/dashboard/register")}
          >
            ➕ Register Student
          </button>
          <button className="btn btn-success" onClick={handleExport}>
            📥 Export Students
          </button>
        </div>
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
                <td>{student.user.phone || student.phone}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
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
              <td colSpan="6">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>{renderPagination()}</nav>
        </div>
      )}
    </div>
  );
};

export default StudentList;
