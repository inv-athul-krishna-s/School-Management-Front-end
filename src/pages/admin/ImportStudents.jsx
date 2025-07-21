import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Input,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "../../api/axios";

const ImportStudents = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect non-admin users
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/unauthorized");
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setErrorMsg("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/students/import/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMsg("Students imported successfully!");
      setFile(null);
    } catch (err) {
      console.error("Import failed:", err);
      setErrorMsg("Failed to import students. Please check the file format.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Import Students via CSV
      </Typography>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Input type="file" inputProps={{ accept: ".csv" }} onChange={handleFileChange} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleImport}
          sx={{ ml: 2 }}
        >
          Import
        </Button>
      </Paper>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg("")}
      >
        <Alert severity="success" onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error" onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportStudents;
