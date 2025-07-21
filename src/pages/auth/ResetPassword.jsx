import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  Box, Button, TextField, Typography, Alert, Paper
} from "@mui/material";
import axios from "../../api/axios"; // Axios should have baseURL "/api"

const ResetPassword = () => {
  const [params] = useSearchParams();
  const uid = params.get("uid");
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>Reset Password</Typography>

        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

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
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
