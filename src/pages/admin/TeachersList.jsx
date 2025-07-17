//TeachersList.jsx
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
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchTeachers = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/teachers/?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTeachers(res.data.results);
      setCount(Math.ceil(res.data.count / 10)); // assuming 10 per page
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const handlePageChange = (_, value) => {
    setPage(value);
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
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher, idx) => (
              <TableRow key={teacher.id}>
                <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                <TableCell>
                  {teacher.user.first_name} {teacher.user.last_name}
                </TableCell>
                <TableCell>{teacher.user.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.subject_specialization}</TableCell>
                <TableCell>{teacher.employee_id}</TableCell>
                <TableCell>{teacher.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={count} page={page} onChange={handlePageChange} color="primary" />
      </Box>
    </Box>
  );
};

export default TeachersList;
