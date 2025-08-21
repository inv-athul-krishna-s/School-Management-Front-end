import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [teacherName, setTeacherName] = useState("Not assigned");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/students/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const studentData = res.data;
        setProfile(studentData);

        const assignedTeacher = studentData.assigned_teacher;

        if (assignedTeacher) {
          if (typeof assignedTeacher === "object" && assignedTeacher.user) {
            const teacherUser = assignedTeacher.user;
            setTeacherName(`${teacherUser.first_name} ${teacherUser.last_name}`);
          } else {
            const teacherId =
              typeof assignedTeacher === "object"
                ? assignedTeacher.id
                : assignedTeacher;

            axios
              .get(`/teachers/${teacherId}/`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => {
                const teacher = res.data.user;
                setTeacherName(`${teacher.first_name} ${teacher.last_name}`);
              })
              .catch((err) => {
                console.error("Failed to fetch teacher info", err);
                setTeacherName("Teacher not found");
              });
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch student profile", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  const user = profile.user;

  return (
    <Box maxWidth="800px" mx="auto" mt={4} px={2}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                width: 64,
                height: 64,
                fontSize: 28,
              }}
            >
              {user.first_name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span">
                {user.username}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" component="span">
                {user.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1" component="span">
                {profile.phone}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Roll Number
              </Typography>
              <Typography variant="body1" component="span">
                {profile.roll_number}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1" component="span">
                {profile.student_class}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1" component="span">
                {new Date(profile.date_of_birth).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Admission Date
              </Typography>
              <Typography variant="body1" component="span">
                {new Date(profile.admission_date).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Assigned Teacher
              </Typography>
              <Typography variant="body1" component="span">
                {teacherName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentProfile;
