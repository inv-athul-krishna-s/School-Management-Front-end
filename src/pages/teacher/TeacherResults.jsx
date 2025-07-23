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
} from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const TeacherResults = () => {
  const { token, user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("/results/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.results?.filter(
          (result) => result.exam?.created_by === user.id
        ) || [];
        setResults(filtered);
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token, user.id]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        📊 Exam Results for My Students
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : results.length === 0 ? (
        <Typography sx={{ mt: 3, color: "text.secondary" }}>
          No results found yet. Once students attend your exams, their results will appear here.
        </Typography>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Exam</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>
                    {res.student?.user?.first_name} {res.student?.user?.last_name}
                  </TableCell>
                  <TableCell>{res.exam?.title}</TableCell>
                  <TableCell>{res.score}</TableCell>
                  <TableCell>{res.grade}</TableCell>
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
