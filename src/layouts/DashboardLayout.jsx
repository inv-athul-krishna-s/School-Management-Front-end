import { useState } from "react";
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
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 220;

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleMobileDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { label: "🏠 Dashboard", path: "/admin/dashboard" },
    { label: "👥 Register User", path: "/admin/dashboard/register" },
    { label: "📝 Create Exam", path: "/admin/dashboard/create-exam" },
    { label: "📚 View Exams", path: "/admin/dashboard/view-exams" },
    { label: "📊 View Results", path: "/admin/dashboard/view-class-results" },
    { label: "👨‍🏫 Teachers", path: "/admin/dashboard/teachers" },
    { label: "👩‍🎓 Students", path: "/admin/dashboard/students" },
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ justifyContent: "flex-end", px: 1 }}>
        {!isMobile && (
          <IconButton onClick={toggleDrawer}>
            {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                minHeight: 48,
                px: 2,
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={isDrawerOpen}
          sx={{
            width: isDrawerOpen ? drawerWidth : 70,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isDrawerOpen ? drawerWidth : 70,
              overflowX: "hidden",
              transition: "width 0.2s ease",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Layout */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* AppBar */}
        <AppBar
          position="fixed"
          color="primary"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            width: "100%",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleMobileDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              School Management System
            </Typography>
            {!isMobile && (
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mr: 3 }}>
                Welcome, {user.username}
              </Typography>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content - FULL WIDTH, NO WHITE SPACE */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f9f9f9",
            mt: "64px", // below AppBar
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
