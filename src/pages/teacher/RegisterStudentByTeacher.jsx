import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const RegisterStudentByTeacher = () => {
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      user: {
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        password: data.password,
      },
      phone: data.phone,
      roll_number: data.roll_number,
      student_class: data.student_class,
      date_of_birth: data.date_of_birth,
      admission_date: data.admission_date,
      status: "active",
    };

    try {
      await axios.post("/students/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student registered successfully");
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to register student");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        🧑‍🎓 Register New Student
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          {...register("first_name", { required: "First name is required" })}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
        />

        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          {...register("last_name", { required: "Last name is required" })}
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
        />

        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          {...register("phone", {
            required: "Phone number is required",
            pattern: { value: /^[0-9]{10}$/, message: "Phone must be 10 digits" },
          })}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Roll Number"
          fullWidth
          margin="normal"
          {...register("roll_number", { required: "Roll number is required" })}
          error={!!errors.roll_number}
          helperText={errors.roll_number?.message}
        />

        <TextField
          label="Class"
          fullWidth
          margin="normal"
          {...register("student_class", { required: "Class is required" })}
          error={!!errors.student_class}
          helperText={errors.student_class?.message}
        />

        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register("date_of_birth", { required: "Date of birth is required" })}
          error={!!errors.date_of_birth}
          helperText={errors.date_of_birth?.message}
        />

        <TextField
          label="Admission Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register("admission_date", { required: "Admission date is required" })}
          error={!!errors.admission_date}
          helperText={errors.admission_date?.message}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register Student
        </Button>
      </form>
    </Box>
  );
};

export default RegisterStudentByTeacher;
