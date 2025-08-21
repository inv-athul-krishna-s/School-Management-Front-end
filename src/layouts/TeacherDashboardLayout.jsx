import React, { useState } from "react";

import ChatIcon from "@mui/icons-material/Chat";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const TeacherDashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

const navItems = [
  { label: "🏠 Dashboard", path: "/teacher/dashboard" },
  { label: "👩‍🎓 Students", path: "/teacher/dashboard/students" },
  { label: "➕ Register Student", path: "/teacher/dashboard/register-student" },
  { label: "📝 Create Exam", path: "/teacher/dashboard/exams/create" },
  { label: "🛠 Manage Exams", path: "/teacher/dashboard/exams/manage" },
  { label: "📊 View Results", path: "/teacher/dashboard/results" },
  { label: "💬 Chat", path: "/teacher/dashboard/chat" }, 
  { label: "👤 Profile", path: "/teacher/dashboard/profile" },
];
  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap>Teacher Panel</Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                "&.active": {
                  backgroundColor: theme.palette.action.selected,
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#1976d2",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            School Management - Teacher
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" }, mx: 2 }}>
            <Typography variant="subtitle1" color="inherit">
              Welcome, {user?.username}
            </Typography>
          </Box>

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="teacher dashboard navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#f9f9f9",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default TeacherDashboardLayout;
