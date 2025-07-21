import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ViewExams = () => {
  const [exams, setExams] = useState([]);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const fetchExams = () => {
    axios
      .get("/exams/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setExams(res.data.results || res.data))
      .catch((err) => console.error("Failed to load exams:", err));
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await axios.delete(`/exams/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Exam deleted!");
      fetchExams(); // reload after delete
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Failed to delete exam.");
    }
  };

  return (
    <Box mx="auto" maxWidth="lg" my={4}>
      <Typography variant="h4" gutterBottom>
        {user?.role === "teacher" ? "My Exams" : "All Exams"}
      </Typography>

      {exams.length === 0 ? (
        <Typography>No exams found.</Typography>
      ) : (
        exams.map((exam) => (
          <Paper
            key={exam.id}
            sx={{
              p: 3,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">{exam.title}</Typography>
              <Typography variant="body2">Class: {exam.target_class}</Typography>
              <Typography variant="body2">
                Start: {new Date(exam.start_time).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Duration: {exam.duration_min} mins
              </Typography>
              {exam.teacher && (
                <Typography variant="body2">
                  Teacher: {exam.teacher.user?.first_name} {exam.teacher.user?.last_name}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/admin/dashboard/edit-exam/${exam.id}`)}
              >
                Edit
              </Button>
              <IconButton color="error" onClick={() => handleDelete(exam.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ViewExams;
