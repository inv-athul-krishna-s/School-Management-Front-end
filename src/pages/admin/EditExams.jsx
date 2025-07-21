import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CreateExam from "./CreateExam"; 

const EditExam = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    axios
      .get(`/exams/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const exam = res.data;
        setInitialValues({
          ...exam,
          questions: exam.questions.map((q) => ({
            text: q.text,
            options: q.options.map((opt) => ({
              text: opt.text,
              is_correct: opt.is_correct,
            })),
          })),
        });
      })
      .catch((err) => console.error("Failed to load exam:", err));
  }, [id, token]);

  if (!initialValues) return <div>Loading exam data...</div>;

  return (
    <CreateExam examId={id} defaultValues={initialValues} isEdit />
  );
};

export default EditExam;
