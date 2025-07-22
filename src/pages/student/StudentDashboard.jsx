import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Paper,
} from "@mui/material";
import { School, Assessment, Person } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [examCount, setExamCount] = useState(0);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load profile and exams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const [profileRes, examsRes] = await Promise.all([
          axios.get("/students/me/", { headers }),
          axios.get("/exams/", { headers }),
        ]);

        setProfile(profileRes.data);
        setExamCount(examsRes.data.length);

        // Extract results
      const exams = Array.isArray(examsRes.data.results) ? examsRes.data.results : [];
const results = exams
  .flatMap((exam) => exam.attempts || [])
  .filter((attempt) => attempt?.score !== undefined)
  .slice(0, 5);



        setRecentResults(results);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={5}>
        {error}
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Welcome, {profile.user.first_name} {profile.user.last_name}
      </Typography>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <School />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Your Class
              </Typography>
              <Typography variant="h6">{profile.student_class}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              <Assessment />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Upcoming Exams
              </Typography>
              <Typography variant="h6">{examCount}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Roll Number
              </Typography>
              <Typography variant="h6">{profile.roll_number}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Recent Exam Results
        </Typography>

        {recentResults.length === 0 ? (
          <Typography>No recent scores found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {recentResults.map((res, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography>
                    <strong>Score:</strong> {res.score?.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Submitted:{" "}
                    {new Date(res.finished_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
