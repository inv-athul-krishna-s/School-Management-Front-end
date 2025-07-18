
import { useRoutes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Login";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import RegisterUser from "../pages/admin/RegisterUser";
import TeachersList from "../pages/admin/TeachersList";
import StudentsList from "../pages/admin/StudentList";

// Teacher Pages
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import RegisterStudent from "../pages/teacher/RegisterStudentByTeacher";
import TeacherStudentList from "../pages/teacher/TeacherStudentList";
import TeacherProfile from "../pages/teacher/TeacherProfile";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
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
          element: <DashboardLayout />,
          children: [
            { path: "", element: <TeacherDashboard /> },
            { path: "register-student", element: <RegisterStudent /> },
            { path: "students", element: <TeacherStudentList /> },
            { path: "profile", element: <TeacherProfile /> },
          ],
        },
      ],
    },
  ]);
  return routes;
};

export default AppRoutes;
