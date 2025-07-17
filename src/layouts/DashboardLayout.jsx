import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  ListItemButton,
  Button,
} from "@mui/material";

const drawerWidth = 240;

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: "🏠 Dashboard", path: "/admin/dashboard" },
    { label: "👥 Register User", path: "/admin/dashboard/register" },
    { label: "📝 Create Exam", path: "/admin/dashboard/create-exam" },
    { label: "📊 View Results", path: "/admin/dashboard/results" },
    { label: "👨‍🏫 Teachers", path: "/admin/dashboard/teachers" },
    { label: "👩‍🎓 Students", path: "/admin/dashboard/students" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
 

<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  <Toolbar>
    {/* Left: App/School Name */}
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      School Management System
    </Typography>

    {/* Center: Welcome */}
    <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
      <Typography variant="h6" component="div">
        Welcome, {user.username}
      </Typography>
    </Box>

    {/* Right: Logout */}
    <Button color="inherit" onClick={logout}>
      Logout
    </Button>
  </Toolbar>
</AppBar>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton component={NavLink} to={item.path}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3, minHeight: "100vh" }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
