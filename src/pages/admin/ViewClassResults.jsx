import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const ViewClassResults = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [results, setResults] = useState([]);
  const { token } = useAuth();

  const handleChange = async (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);

    try {
      const res = await axios.get(`/results/class/${cls}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      console.error("Failed to fetch results:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📚 View Class-wise Exam Results
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Class</InputLabel>
        <Select value={selectedClass} label="Select Class" onChange={handleChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              Class {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {results.length > 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Exam</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Started At</TableCell>
                <TableCell>Finished At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.student_name}</TableCell>
                  <TableCell>{r.exam_title}</TableCell>
                  <TableCell>{r.score}</TableCell>
                  <TableCell>{new Date(r.started_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(r.finished_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {selectedClass && results.length === 0 && (
        <Typography color="text.secondary" mt={2}>
          No results found for Class {selectedClass}.
        </Typography>
      )}
    </Box>
  );
};

export default ViewClassResults;
