import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const TeacherStudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`/students/?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.results || [];
        setStudents(data);

        const total = res.data.count || 0;
        const perPage = data.length || 1;
        setTotalPages(Math.ceil(total / perPage));
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, [page, token]);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
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
      <ul className="pagination justify-content-center mt-3">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
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
              <button className="page-link" onClick={() => setPage(p)}>
                {p}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next »
          </button>
        </li>
      </ul>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Students
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student, idx) => (
                <TableRow key={student.id}>
                  <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                  <TableCell>
                    {student.user.first_name} {student.user.last_name}
                  </TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>{student.student_class}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() =>
                          navigate(`/teacher/dashboard/students/${student.id}/edit`)
                        }
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No students assigned.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination Rendered */}
      {totalPages > 1 && renderPagination()}
    </Box>
  );
};

export default TeacherStudentList;
