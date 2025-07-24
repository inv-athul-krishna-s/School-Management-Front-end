import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Slide,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });
    try {
      await axios.post("/password-reset/request/", { email });
      setStatus({
        loading: false,
        success: "Check your email for a reset link.",
        error: null,
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: null,
        error: "Failed to send reset email.",
      });
    }
  };

  // Trigger slide-in animation on mount
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
        backgroundColor: "#f0f4f8",
        p: 2,
      }}
    >
      <Slide direction="down" in={showForm} timeout={600}>
        <Paper
          elevation={6}
          sx={{
            maxWidth: 420,
            width: "100%",
            p: 4,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            textAlign="center"
            gutterBottom
          >
            Forgot Password
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Enter your registered email to receive a reset link.
          </Typography>

          {status.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {status.error}
            </Alert>
          )}
          {status.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {status.success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              type="email"
              required
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={status.loading}
              sx={{ mt: 2, py: 1.1, fontWeight: "bold" }}
            >
              {status.loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "500",
              }}
            >
              ← Back to Login
            </Link>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default ForgotPassword;
