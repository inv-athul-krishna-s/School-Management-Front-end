import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const classOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    target_class: "",
    start_time: "",
    duration_min: "",
    questions: [],
  });

  useEffect(() => {
    axios
      .get(`/exams/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("Failed to load exam:", err);
        alert("Error loading exam.");
      });
  }, [id, token]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: "",
          options: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
        },
      ],
    });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options.push({ text: "", is_correct: false });
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      target_class: formData.target_class,
      start_time: formData.start_time,
      duration_min: formData.duration_min,
      questions: formData.questions,
    };

    try {
      await axios.put(`/exams/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Exam updated successfully!");
      navigate("/teacher/dashboard/exams/manage");
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      alert("Failed to update exam.");
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        ✏️ Edit Exam
      </Typography>

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Exam Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />

          <TextField
            select
            fullWidth
            label="Class"
            value={formData.target_class}
            onChange={(e) =>
              setFormData({ ...formData, target_class: e.target.value })
            }
            margin="normal"
            required
          >
            {classOptions.map((cls) => (
              <MenuItem key={cls} value={cls}>
                Class {cls}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) =>
              setFormData({ ...formData, start_time: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={formData.duration_min}
            onChange={(e) =>
              setFormData({ ...formData, duration_min: e.target.value })
            }
            margin="normal"
            required
          />
        </Paper>

        {formData.questions.map((q, qIndex) => (
          <Paper key={qIndex} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">Question {qIndex + 1}</Typography>
            <TextField
              fullWidth
              label="Question Text"
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(qIndex, "text", e.target.value)
              }
              margin="normal"
              required
            />

            {q.options.map((opt, oIndex) => (
              <Box key={oIndex} sx={{ display: "flex", gap: 2, mb: 1 }}>
                <TextField
                  label={`Option ${oIndex + 1}`}
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, "text", e.target.value)
                  }
                  required
                />
                <TextField
                  select
                  label="Correct?"
                  value={opt.is_correct ? "true" : "false"}
                  onChange={(e) =>
                    handleOptionChange(
                      qIndex,
                      oIndex,
                      "is_correct",
                      e.target.value === "true"
                    )
                  }
                >
                  <MenuItem value="false">❌ No</MenuItem>
                  <MenuItem value="true">✅ Yes</MenuItem>
                </TextField>
              </Box>
            ))}

            <Button variant="outlined" onClick={() => addOption(qIndex)}>
              ➕ Add Option
            </Button>
          </Paper>
        ))}

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          onClick={addQuestion}
        >
          ➕ Add Question
        </Button>

        <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditExam;
