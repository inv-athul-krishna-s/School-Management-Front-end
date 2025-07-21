// src/pages/Unauthorized.jsx
import { Box, Typography } from "@mui/material";

const Unauthorized = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error">
        403 - Unauthorized
      </Typography>
      <Typography>You do not have permission to access this page.</Typography>
    </Box>
  );
};

export default Unauthorized;
