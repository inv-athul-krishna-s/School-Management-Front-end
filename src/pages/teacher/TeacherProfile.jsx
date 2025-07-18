import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const TeacherProfile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`/teachers/${user.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [token, user.id]);

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><strong>Name:</strong> {profile.user.first_name} {profile.user.last_name}</Grid>
          <Grid item xs={12} md={6}><strong>Email:</strong> {profile.user.email}</Grid>
          <Grid item xs={12} md={6}><strong>Phone:</strong> {profile.phone}</Grid>
          <Grid item xs={12} md={6}><strong>Subject:</strong> {profile.subject_specialization}</Grid>
          <Grid item xs={12} md={6}><strong>Employee ID:</strong> {profile.employee_id}</Grid>
          <Grid item xs={12} md={6}><strong>Date of Joining:</strong> {profile.date_of_joining}</Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TeacherProfile;
