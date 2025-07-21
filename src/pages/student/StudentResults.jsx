import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const StudentResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get("/exams/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const exams = res.data;
        const attempts = [];

        exams.forEach((exam) => {
          exam.attempts.forEach((attempt) => {
            if (attempt.student.user.username === localStorage.getItem("username")) {
              attempts.push({
                examTitle: exam.title,
                score: attempt.score,
                startedAt: attempt.started_at,
                finishedAt: attempt.finished_at,
              });
            }
          });
        });

        setResults(attempts);
      })
      .catch((err) => console.error("Error fetching exam results", err));
  }, []);

  return (
    <Box maxWidth="700px" mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        My Exam Results
      </Typography>

      {results.length === 0 ? (
        <Typography>No exam results found.</Typography>
      ) : (
        <List>
          {results.map((r, idx) => (
            <Paper key={idx} sx={{ my: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={r.examTitle}
                  secondary={
                    <>
                      <Typography>Score: {r.score.toFixed(2)}%</Typography>
                      <Typography>
                        Started: {new Date(r.startedAt).toLocaleString()}
                      </Typography>
                      <Typography>
                        Finished: {new Date(r.finishedAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default StudentResults;
