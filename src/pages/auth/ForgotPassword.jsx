
import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import axios from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });
    try {
      await axios.post("/password-reset/request/", { email });
      setStatus({ loading: false, success: "Check your email for a reset link.", error: null });
    } catch (err) {
      setStatus({ loading: false, success: null, error: "Failed to send reset email." });
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      {status.error && <Alert severity="error">{status.error}</Alert>}
      {status.success && <Alert severity="success">{status.success}</Alert>}
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
        <Button variant="contained" type="submit" fullWidth disabled={status.loading}>
          {status.loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Box>
  );
};

export default ForgotPassword;
