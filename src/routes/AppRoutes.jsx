import { useRoutes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentDashboardLayout from "../layouts/StudentDashboardLayout";
import TeacherDashboardLayout from "../layouts/TeacherDashboardLayout";
import ChatPage from "../pages/ChatPage";

// Auth Pages
import Login from "../pages/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import RegisterUser from "../pages/admin/RegisterUser";
import TeachersList from "../pages/admin/TeachersList";
import StudentsList from "../pages/admin/StudentList";
import ImportStudents from "../pages/admin/ImportStudents";
import Unauthorized from "../pages/Unauthorized";
import CreateExam from "../pages/admin/CreateExam";
import ViewExams from "../pages/admin/ViewExams";
import EditExams from "../pages/admin/EditExams";
import ViewClassResults from "../pages/admin/ViewClassResults";
import EditTeacher from "../pages/admin/EditTeacher";
import EditStudent from "../pages/admin/EditStudent";

// Teacher Pages
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import RegisterStudent from "../pages/teacher/RegisterStudentByTeacher";
import TeacherStudentList from "../pages/teacher/TeacherStudentList";
import TeacherProfile from "../pages/teacher/TeacherProfile";


import EditStudentByTeacher from "../pages/teacher/EditStudentByTeacher";
import TeacherExamList from "../pages/teacher/TeacherExamList";
import CreateExams from "../pages/teacher/CreateExams";
import EditExam from "../pages/teacher/EditExam";
import TeacherResults from "../pages/teacher/TeacherResults";

 

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import StudentResults from "../pages/student/StudentResults";
import AvailableExams from "../pages/student/AvailableExams";
import AttemptExam from "../pages/student/AttemptExam";



import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password", element: <ResetPassword /> },
      ],
    },
    {
      path: "/admin",
      element: <ProtectedLayout />,
      children: [
        {
          path: "dashboard",
          element: <DashboardLayout />,
          children: [
            { path: "", element: <AdminDashboard /> },
            { path: "register", element: <RegisterUser /> },
            { path: "teachers", element: <TeachersList /> },
            { path: "students", element: <StudentsList /> },
            { path: "import-students", element: <ImportStudents /> },
            { path: "unauthorized", element: <Unauthorized /> },
            { path: "create-exam", element: <CreateExam /> },
            { path: "view-exams", element: <ViewExams /> },
            { path: "edit-exam/:id", element: <EditExams /> },
            { path: "view-class-results", element: <ViewClassResults /> },
            { path: "edit-teacher/:id", element: <EditTeacher /> },
            { path: "edit-student/:id", element: <EditStudent /> },
          ],
        },
      ],
    },
    {
      path: "/teacher",
      element: <ProtectedLayout />,
      children: [
        {
          path: "dashboard",
          element: <TeacherDashboardLayout />,
          children: [
            { path: "", element: <TeacherDashboard /> },
            { path: "register-student", element: <RegisterStudent /> },
            { path: "students", element: <TeacherStudentList /> },
            { path: "students/:id/edit", element: <EditStudentByTeacher /> },
            { path: "profile", element: <TeacherProfile /> },
            { path: "results", element: <TeacherResults /> },
            { path: "exams/create", element: <CreateExams /> },
            { path: "exams/manage", element: <TeacherExamList /> },

            { path: "exams/:id/edit", element: <EditExam /> },
            { path: "chat", element: <ChatPage /> }

          ],
        },
      ],
    },
    {
      path: "/student",
      element: <ProtectedLayout />,
      children: [
        {
          path: "dashboard",
          element: <StudentDashboardLayout />,
          children: [
            { path: "", element: <StudentDashboard /> },
            { path: "profile", element: <StudentProfile /> },
            { path: "results", element: <StudentResults /> },
            { path: "exams", element: <AvailableExams /> },
            { path: "exams/:id", element: <AttemptExam /> },
            { path: "chat", element: <ChatPage /> },
          ],
        },
      ],
    },
  ]);

  return routes;
};

export default AppRoutes;
