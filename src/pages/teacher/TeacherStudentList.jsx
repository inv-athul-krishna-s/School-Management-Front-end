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
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/students/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // API returns only relevant students from backend now
        const allStudents = res.data.results || [];
        setStudents(allStudents);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, [token]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Students
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
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
                <TableCell colSpan={5}>No students assigned.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TeacherStudentList;
