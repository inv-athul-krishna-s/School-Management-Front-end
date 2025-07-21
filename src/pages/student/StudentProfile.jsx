import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios
      .get("/students/me/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Error fetching student profile", err));
  }, []);

  if (!student) return <Typography>Loading...</Typography>;

  return (
    <Box maxWidth="600px" mx="auto" mt={5}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Typography>
            <strong>Name:</strong> {student.user.first_name} {student.user.last_name}
          </Typography>
          <Typography>
            <strong>Username:</strong> {student.user.username}
          </Typography>
          <Typography>
            <strong>Email:</strong> {student.user.email}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {student.phone}
          </Typography>
          <Typography>
            <strong>Class:</strong> {student.student_class}
          </Typography>
          <Typography>
            <strong>Roll Number:</strong> {student.roll_number}
          </Typography>
          <Typography>
            <strong>Status:</strong> {student.status}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentProfile;
