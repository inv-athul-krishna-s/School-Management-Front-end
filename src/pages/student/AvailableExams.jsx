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
import { useNavigate } from "react-router-dom";

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/exams/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const data = Array.isArray(res.data?.results) ? res.data.results : [];
        setExams(data);
      })
      .catch((err) => console.error("Error fetching exams", err));
  }, []);

  // Categorize exams
  const attemptedExams = exams.filter((exam) => exam.attempts && exam.attempts.length > 0);
  const unattemptedExams = exams.filter((exam) => !exam.attempts || exam.attempts.length === 0);

  const filteredExams =
    filter === "upcoming" ? unattemptedExams :
    filter === "unattempted" ? unattemptedExams :
    attemptedExams;

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
                {filter !== "finished" && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/student/dashboard/exams/${exam.id}`)
                    }
                  >
                    Start
                  </Button>
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
