import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchTeachers = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/teachers/?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTeachers(res.data.results || []);
      const total = res.data.count || 0;
      const perPage = res.data.results.length || 1;
      setTotalPages(Math.ceil(total / perPage));
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  const handleViewStudents = async (teacher) => {
    try {
      const res = await axios.get(`/teachers/${teacher.id}/students/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudents(res.data.results || res.data || []);
      setSelectedTeacher(teacher);
      setOpenModal(true);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const handleDeleteTeacher = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/teachers/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTeachers(page);
    } catch (err) {
      console.error("Failed to delete teacher:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const renderPagination = () => {
    const pages = [];
    const pageLimit = 3;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      } else if (
        (i === page - 2 && i > 1) ||
        (i === page + 2 && i < totalPages)
      ) {
        pages.push("ellipsis");
      }
    }

    return (
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            « Prev
          </button>
        </li>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <li key={`ellipsis-${idx}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(p)}>
                {p}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
            Next »
          </button>
        </li>
      </ul>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          All Teachers
        </Typography>
        {user?.role === "admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/dashboard/register")}
          >
            Register Teacher
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher, idx) => (
              <TableRow key={teacher.id}>
                <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                <TableCell>{teacher.user.first_name} {teacher.user.last_name}</TableCell>
                <TableCell>{teacher.user.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.subject_specialization}</TableCell>
                <TableCell>{teacher.employee_id}</TableCell>
                <TableCell>{teacher.status}</TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewStudents(teacher)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      color="primary"
                      onClick={() => navigate(`/admin/dashboard/edit-teacher/${teacher.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <nav>{renderPagination()}</nav>
        </Box>
      )}

      {/* Students Modal */}
      <Dialog open={openModal} fullWidth maxWidth="md" onClose={() => setOpenModal(false)}>
        <DialogTitle>
          Students under {selectedTeacher?.user.first_name} {selectedTeacher?.user.last_name}
          <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {students.length === 0 ? (
            <Typography>No students assigned.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Roll Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((stu, idx) => (
                  <TableRow key={stu.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{stu.user.first_name} {stu.user.last_name}</TableCell>
                    <TableCell>{stu.user.email}</TableCell>
                    <TableCell>{stu.student_class}</TableCell>
                    <TableCell>{stu.roll_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeachersList;
