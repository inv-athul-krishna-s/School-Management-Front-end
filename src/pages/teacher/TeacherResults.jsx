import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const examTypes = [
  { label: "All", value: "" },
  { label: "Mid-Term", value: "mid" },
  { label: "Series Exam", value: "series" },
];

const TeacherResults = () => {
  const { token, user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [examFilter, setExamFilter] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get all exams for this teacher
        const examsRes = await axios.get("/exams/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const examsArray = examsRes.data.results || examsRes.data || [];

        const myExams = examsArray;

        const allResults = [];

        // Fetch results per exam
        for (const exam of myExams) {
          const res = await axios.get(`/exams/${exam.id}/results/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          res.data.attempts.forEach((attempt) => {
            allResults.push({
              ...attempt,
              exam_title: res.data.exam,
            });
          });
        }

        setResults(allResults);
      } catch (err) {
        console.error("Failed to fetch exam results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token, user.id]);

  const filteredResults = results.filter((res) => {
    const matchesStudent =
      res.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam =
      examFilter === "" || res.exam_title.toLowerCase().includes(examFilter);
    return matchesStudent && matchesExam;
  });

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Exam Results
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Student"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
        />
        <TextField
          select
          label="Exam Type"
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          variant="outlined"
        >
          {examTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredResults.length === 0 ? (
        <Typography sx={{ mt: 3, color: "text.secondary" }}>
          No matching results found.
        </Typography>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Exam</TableCell>
                <TableCell>Score (%)</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Finished</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResults.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>{res.student_name}</TableCell>
                  <TableCell>{res.exam_title}</TableCell>
                  <TableCell>{res.score}</TableCell>
                  <TableCell>
                    {new Date(res.started_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(res.finished_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default TeacherResults;
