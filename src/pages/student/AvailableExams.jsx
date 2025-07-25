import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";  // <-- Added useLocation

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();
  const location = useLocation();  // <-- Get navigation state

  useEffect(() => {
    const fetchExams = () => {
      axios
        .get("/exams/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const data = Array.isArray(res.data?.results) ? res.data.results : res.data;
          setExams(data);
        })
        .catch((err) => console.error("Error fetching exams", err));
    };

    fetchExams();

    // If redirected from AttemptExam with refresh flag
    if (location.state?.refresh) {
      fetchExams();
      window.history.replaceState({}, document.title); // Clear refresh flag
    }
  }, [location]);

  const now = new Date();

  // Categorize exams based on time and attempts
  const categorizedExams = exams.reduce(
    (acc, exam) => {
      const startTime = new Date(exam.start_time);
      const endTime = new Date(startTime.getTime() + exam.duration_min * 60000);
      const isAttempted = exam.attempts && exam.attempts.length > 0;

      if (isAttempted) {
        acc.finished.push(exam);
      } else if (now < startTime) {
        acc.upcoming.push(exam);
      } else if (now > endTime) {
        acc.unattempted.push(exam);
      }
      return acc;
    },
    { upcoming: [], unattempted: [], finished: [] }
  );

  const filteredExams = categorizedExams[filter] || [];

  return (
    <Box maxWidth="700px" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Available Exams
      </Typography>

      {/* Filter Dropdown */}
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel id="exam-filter-label">Filter Exams</InputLabel>
        <Select
          labelId="exam-filter-label"
          value={filter}
          label="Filter Exams"
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="upcoming">Upcoming Exams</MenuItem>
          <MenuItem value="unattempted">Unattempted Exams</MenuItem>
          <MenuItem value="finished">Finished Exams</MenuItem>
        </Select>
      </FormControl>

      {filteredExams.length === 0 ? (
        <Typography>No exams found for this category.</Typography>
      ) : (
        <List>
          {filteredExams.map((exam) => (
            <Paper key={exam.id} sx={{ my: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={exam.title}
                  secondary={`Class: ${exam.target_class}`}
                />
                {filter === "upcoming" && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/student/dashboard/exams/${exam.id}`)
                    }
                  >
                    Start
                  </Button>
                )}
                {filter === "unattempted" && (
                  <Typography variant="body2" color="error">
                    Not Attempted
                  </Typography>
                )}
                {filter === "finished" && (
                  <Typography variant="body2" color="textSecondary">
                    Attempted
                  </Typography>
                )}
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AvailableExams;
