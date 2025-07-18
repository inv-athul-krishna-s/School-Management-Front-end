import { useEffect, useState } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const TeacherStudentList = () => {
  const [students, setStudents] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    axios
      .get("/students/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const assignedStudents = res.data.filter(
          (student) => student.assigned_teacher && student.assigned_teacher === user.id
        );
        setStudents(assignedStudents);
      })
      .catch((err) => console.error(err));
  }, [token, user.id]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Assigned Students
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.user.first_name} {student.user.last_name}</TableCell>
                <TableCell>{student.user.email}</TableCell>
                <TableCell>{student.student_class}</TableCell>
                <TableCell>{student.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TeacherStudentList;
