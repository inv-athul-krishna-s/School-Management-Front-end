import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const TeacherExamList = () => {
  const { token, user } = useAuth();
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const response = await axios.get("/exams/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const examData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const teacherExams = examData.filter((exam) => exam.created_by === user.id);
      setExams(teacherExams);
    } catch (error) {
      console.error("Failed to load exams:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await axios.delete(`/exams/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(exams.filter((exam) => exam.id !== id));
      alert("✅ Exam deleted successfully.");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("Failed to delete exam.");
    }
  };

  useEffect(() => {
    fetchExams();
  }, [token]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        🧑‍🏫 Manage My Exams
      </Typography>

      {exams.length === 0 ? (
        <Typography>No exams created yet.</Typography>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Duration (mins)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>Class {exam.target_class}</TableCell>
                  <TableCell>{new Date(exam.start_time).toLocaleString()}</TableCell>
                  <TableCell>{exam.duration_min}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => navigate(`/teacher/dashboard/exams/${exam.id}/edit`)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(exam.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/teacher/dashboard/exams/create")}
        >
          ➕ Create New Exam
        </Button>
      </Box>
    </Box>
  );
};

export default TeacherExamList;
