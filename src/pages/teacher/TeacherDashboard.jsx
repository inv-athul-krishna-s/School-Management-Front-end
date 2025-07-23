import { Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.username} 🎓
      </Typography>
      <Typography variant="subtitle1">
        Use the left panel to manage your students, exams, and profile.
      </Typography>
    </Box>
  );
};

export default TeacherDashboard;
