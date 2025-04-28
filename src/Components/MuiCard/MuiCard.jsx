import { Card, Grid, Typography, Box } from "@mui/material";
import React from "react";

const MuiCard = ({ title, value, icon, valueStyle }) => {
  return (
    <Card
      sx={{
        p: 2.5,
        display: "flex",
        alignItems: "center",
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Icon */}
      <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>{icon}</Box>

      {/* Text Section */}
      <Box>
        <Typography variant="body2" sx={{ color: "#6c757d", fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", ...valueStyle }}>
          {value}
        </Typography>
      </Box>
    </Card>
  );
};

export default MuiCard;
