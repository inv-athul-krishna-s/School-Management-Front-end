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
  const [timeLeft, setTimeLeft] = useState(0); // in milliseconds

  useEffect(() => {
    axios
      .get(`/exams/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setExam(res.data);

        // Check if already submitted
        if (res.data.attempts && res.data.attempts.length > 0) {
          setAlreadySubmitted(true);
        }

        // Calculate time left for the timer
        const startTime = new Date(res.data.start_time).getTime();
        const durationMs = res.data.duration_min * 60000;
        const endTime = startTime + durationMs;
        const now = Date.now();
        const initialTimeLeft = Math.max(endTime - now, 0);
        setTimeLeft(initialTimeLeft);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Exam fetch error", err);
        setLoading(false);
      });
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || alreadySubmitted || loading) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          handleSubmit(true); // Auto-submit
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, alreadySubmitted, loading]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = (auto = false) => {
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
        if (auto) {
          alert("Time’s up! Your exam has been auto-submitted.");
        } else {
          alert(`Exam submitted! Your score: ${res.data.score.toFixed(2)}%`);
        }
        navigate("/student/dashboard", { state: { refresh: true } });

      })
      .catch((err) => {
        console.error("Exam submit error", err);
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

      {/* Timer */}
      <Typography variant="h6" color={timeLeft < 60000 ? "error" : "textPrimary"} gutterBottom>
        Time Left: {formatTime(timeLeft)}
      </Typography>

      {/* Questions */}
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
        onClick={() => handleSubmit(false)}
        sx={{ mt: 2 }}
      >
        Submit Exam
      </Button>
    </Box>
  );
};

export default AttemptExam;
