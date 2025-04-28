import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React from "react";

export default function BundleCard({ bundle, isSelected }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  return (
    <Card
      className="cursor-pointer transition-all duration-200"
      sx={{
        borderRadius: "18px",
        background: theme.palette.background.paper,
        boxShadow: "0px 4px 5px rgba(0,0,0,0.1)",
        border: `2px solid ${
          isSelected
            ? isDarkMode
              ? theme.palette.common.white
              : theme.palette.primary.main
            : "transparent"
        }`,
        "&:hover": {
          boxShadow: "0px 6px 10px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent className="flex flex-row justify-between items-center p-4">
        {/* Left Section (Bundle Info) */}
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {bundle.bundleDetails?.[0]?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bundle.bundleInfo?.bundleCode}
          </Typography>
        </Box>

        {/* Right Section (Price & Cost) */}
        <Box textAlign="right">
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: isDarkMode
                ? theme.palette.common.white
                : theme.palette.primary.main,
            }}
          >
            ${bundle.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cost: ${bundle.cost}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
