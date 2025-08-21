import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const InfoRow = ({ label, value }) => (
  <Grid container spacing={1} sx={{ mb: 1 }}>
    <Grid item xs={5} sm={4}>
      <Typography fontWeight="bold" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={7} sm={8}>
      <Typography color="text.primary">{value || "—"}</Typography>
    </Grid>
  </Grid>
);

const TeacherProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/teachers/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load teacher profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Typography variant="h6" color="error" align="center">
        Failed to load profile.
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        👤 Profile Information
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Personal Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <InfoRow label="Full Name" value={`${profile.user.first_name} ${profile.user.last_name}`} />
        <InfoRow label="Username" value={profile.user.username} />
        <InfoRow label="Email" value={profile.user.email} />
        <InfoRow label="Phone (User)" value={profile.user.phone} />
        <InfoRow label="Phone (Profile)" value={profile.phone} />

        <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
          Professional Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <InfoRow label="Subject Specialization" value={profile.subject_specialization} />
        <InfoRow label="Employee ID" value={profile.employee_id} />
        <InfoRow label="Date of Joining" value={profile.date_of_joining} />
        <InfoRow label="Status" value={profile.status} />
      </Paper>
    </Box>
  );
};

export default TeacherProfile;
