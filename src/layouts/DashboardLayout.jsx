import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="bg-dark text-white p-3" style={{ width: "240px" }}>
        <h4 className="text-center mb-4">Admin Panel</h4>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/admin/dashboard">🏠 Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/admin/dashboard/register">👥 Register User</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/admin/dashboard/create-exam">📝 Create Exam</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/admin/dashboard/results">📊 View Results</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/admin/dashboard/teachers">👨‍🏫 Teachers</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/admin/dashboard/students">👩‍🎓 Students</NavLink>
          </li>
          <li className="mt-auto nav-item">
            <button onClick={logout} className="btn btn-outline-light w-100 mt-4">Logout</button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Topbar */}
        <header className="bg-light shadow-sm p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Welcome, {user.username}</h5>
        </header>

        {/* Page Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
