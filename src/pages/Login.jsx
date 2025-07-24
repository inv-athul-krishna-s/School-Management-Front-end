import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Slide,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpeg"; // Replace with your logo
import BackgroundImg from "../assets/school.jpeg"; // Your background image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  useState(() => {
    const timer = setTimeout(() => setShowForm(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${BackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Slide direction="up" in={showForm} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            maxWidth: 420,
            width: "100%",
            p: 4,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(8px)", // Blur effect on background
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <img
            src={Logo}
            alt="School Logo"
            style={{ width: 80, height: 80, marginBottom: 16 }}
          />

          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            textAlign="center"
            gutterBottom
          >
            School Management System
          </Typography>

          <Typography
            variant="subtitle1"
            color="textSecondary"
            textAlign="center"
            mb={3}
          >
            Login to continue
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.2, fontWeight: "bold", fontSize: "1rem" }}
            >
              LOGIN
            </Button>

            <Box textAlign="right" mt={2}>
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontSize: "0.9rem",
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </form>
        </Paper>
      </Slide>
    </Box>
  );
};

export default Login;
