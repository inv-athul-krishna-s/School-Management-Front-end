import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Slide,
} from "@mui/material";
import axios from "../../api/axios";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const uid = params.get("uid");
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/password-reset/confirm/", {
        uid,
        token,
        new_password: newPassword,
      });
      setSuccess("✅ Password has been reset.");
      setError("");
    } catch (err) {
      setError("❌ Link is invalid or expired.");
      setSuccess("");
    }
  };

  // Trigger slide animation
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
      <Slide direction="up" in={showForm} timeout={600}>
        <Paper
          elevation={6}
          sx={{
            maxWidth: 420,
            width: "100%",
            p: 4,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            textAlign="center"
            gutterBottom
          >
            Reset Password
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Enter your new password below.
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, py: 1.1, fontWeight: "bold" }}
            >
              Submit
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

export default ResetPassword;
