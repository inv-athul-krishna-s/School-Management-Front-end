import { Box, Grid, Paper, Typography, Avatar } from "@mui/material";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Total Students",
      count: 120,
      icon: <FaUserGraduate size={32} />,
      bgColor: "#1976d2",
    },
    {
      title: "Total Teachers",
      count: 15,
      icon: <FaChalkboardTeacher size={32} />,
      bgColor: "#2e7d32",
    },
    {
      title: "Upcoming Exams",
      count: 3,
      icon: <FaCalendarAlt size={32} />,
      bgColor: "#ed6c02",
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: card.bgColor,
                color: "#fff",
              }}
              elevation={3}
            >
              <Avatar sx={{ bgcolor: "transparent" }}>{card.icon}</Avatar>
              <Box>
                <Typography variant="subtitle1">{card.title}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {card.count}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
