import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [examCount, setExamCount] = useState(0);
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    axios.get("/students/me/").then((res) => setProfile(res.data));
    axios.get("/exams/").then((res) => setExamCount(res.data.length));
  }, []);

  useEffect(() => {
    // load results from all taken exams
    axios.get("/exams/").then((res) => {
      const exams = res.data;
      const results = exams
        .flatMap((exam) => exam.attempts || [])
        .filter((attempt) => attempt?.score !== undefined)
        .slice(0, 5); // last 5 results
      setRecentResults(results);
    });
  }, []);

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Welcome, {profile.user.first_name} {profile.user.last_name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Class</Typography>
              <Typography>{profile.student_class}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Upcoming Exams</Typography>
              <Typography>{examCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Recent Exam Results
        </Typography>
        {recentResults.length === 0 ? (
          <Typography>No recent scores found.</Typography>
        ) : (
          recentResults.map((res, idx) => (
            <Card key={idx} sx={{ mb: 2 }}>
              <CardContent>
                <Typography>Score: {res.score?.toFixed(2)}%</Typography>
                <Typography>Submitted: {new Date(res.finished_at).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default StudentDashboard;