import { useRoutes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import RegisterUser from "../pages/RegisterUser";
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
            // Add other pages like register, create-exam, etc here
            { path: "register",element: <RegisterUser />}
          ],
        },
      ],
    },
  ]);
  return routes;
};

export default AppRoutes;
