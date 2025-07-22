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
  CircularProgress,
} from "@mui/material";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/students/results/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setResults(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching student results", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box maxWidth="700px" mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        My Exam Results
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : results.length === 0 ? (
        <Typography>No exam results found.</Typography>
      ) : (
        <List>
          {results.map((r, idx) => (
            <Paper key={idx} sx={{ my: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={r.exam_title}
                  secondary={
                    <>
                      <Typography>Score: {r.score?.toFixed(2)}%</Typography>
                      <Typography>
                        Started:{" "}
                        {r.started_at
                          ? new Date(r.started_at).toLocaleString()
                          : "N/A"}
                      </Typography>
                      <Typography>
                        Finished:{" "}
                        {r.finished_at
                          ? new Date(r.finished_at).toLocaleString()
                          : "N/A"}
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
