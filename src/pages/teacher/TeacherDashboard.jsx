import { useAuth } from "../../context/AuthContext";
import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">📋 View Students</Typography>
            <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={() => navigate("students")}>
              Go
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">📝 Register Student</Typography>
            <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={() => navigate("register-student")}>Go</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">👤 My Profile</Typography>
            <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={() => navigate("profile")}>Go</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;
