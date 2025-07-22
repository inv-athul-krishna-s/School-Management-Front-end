import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
} from "@mui/material";

const AttemptExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/exams/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setExam(res.data);

        // Check if this exam has already been attempted
        if (res.data.attempts && res.data.attempts.length > 0) {
          setAlreadySubmitted(true);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Exam fetch error", err);
        setLoading(false);
      });
  }, [id]);

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    const payload = {
      answers: Object.entries(answers).map(([question_id, option_id]) => ({
        question_id: parseInt(question_id),
        option_id: parseInt(option_id),
      })),
    };

    axios
      .post(`/exams/${id}/submit/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        alert(`Exam submitted! Your score: ${res.data.score.toFixed(2)}%`);
        navigate("/student/dashboard");
      })
      .catch((err) => {
  console.error("Exam submit error", err);
  console.error("Backend response:", err.response?.data);

  if (err.response?.status === 403) {
    alert(err.response.data?.detail || "Forbidden: You can't submit this exam.");
  } else {
    alert("Error submitting exam.");
  }
});

  };

  if (loading) return <Typography>Loading exam...</Typography>;

  if (!exam) return <Typography>Error loading exam.</Typography>;

  if (alreadySubmitted) {
    return (
      <Box maxWidth="600px" mx="auto" mt={4}>
        <Typography variant="h5" color="primary" gutterBottom>
          You’ve already submitted this exam.
        </Typography>
        <Typography>
          You can go back to the dashboard to check your results or other exams.
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/student/dashboard")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        {exam.title}
      </Typography>

      {exam.questions.map((q) => (
        <Paper key={q.id} sx={{ my: 2, p: 2 }}>
          <Typography fontWeight="bold">{q.text}</Typography>
          <RadioGroup
            name={`question-${q.id}`}
            value={answers[q.id] || ""}
            onChange={(e) => handleSelect(q.id, parseInt(e.target.value))}
          >
            {q.options.map((opt) => (
              <FormControlLabel
                key={opt.id}
                value={opt.id}
                control={<Radio />}
                label={opt.text}
              />
            ))}
          </RadioGroup>
        </Paper>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Submit Exam
      </Button>
    </Box>
  );
};

export default AttemptExam;
