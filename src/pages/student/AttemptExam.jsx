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

  useEffect(() => {
    axios
      .get(`/exams/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setExam(res.data))
      .catch((err) => console.error("Exam fetch error", err));
  }, [id]);

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    const payload = {
      answers: Object.entries(answers).map(([question_id, option_id]) => ({
        question_id,
        option_id,
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
        alert("Error submitting exam.");
      });
  };

  if (!exam) return <Typography>Loading exam...</Typography>;

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
            onChange={(e) => handleSelect(q.id, e.target.value)}
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
