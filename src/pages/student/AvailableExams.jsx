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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/exams/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Error fetching exams", err));
  }, []);

  return (
    <Box maxWidth="700px" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Available Exams
      </Typography>

      {exams.length === 0 ? (
        <Typography>No exams available right now.</Typography>
      ) : (
        <List>
          {exams.map((exam) => (
            <Paper key={exam.id} sx={{ my: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={exam.title}
                  secondary={`Created by: ${exam.teacher.user.first_name} | Class: ${exam.target_class}`}
                />
                <Button
                  variant="contained"
                  onClick={() => navigate(`/student/dashboard/exam/${exam.id}`)}
                >
                  Start
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AvailableExams;
