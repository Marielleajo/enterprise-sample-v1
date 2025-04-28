import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/styles";
import Grid from "@mui/material/Grid2";
export default function OrderSummary({ bundle, quantity }) {
  const theme = useTheme();
  const totalPrice = quantity * (bundle?.price || 0);

  return (
    <Grid
      container
      spacing={1}
      size={{ xs: 12, sm: 12 }}
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: 3,
        borderRadius: "18px",
        // marginTop: 4,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Order Summary
      </Typography>

      <Divider />

      <Grid container size={12} spacing={2} mt={2}>
        <Grid item size={4}>
          <Typography variant="body2" fontWeight="bold">
            Unit Price
          </Typography>
        </Grid>
        <Grid item size={4}>
          <Typography variant="body2" fontWeight="bold">
            Quantity
          </Typography>
        </Grid>
        <Grid item size={4}>
          <Typography variant="body2" fontWeight="bold">
            Bundle Price
          </Typography>
        </Grid>
      </Grid>

      {/* Values */}
      <Grid container size={12} spacing={2} mt={1}>
        <Grid item size={4}>
          <Typography variant="body2">
            ${bundle?.price?.toFixed(2) || "0.00"}
          </Typography>
        </Grid>
        <Grid item size={4}>
          <Typography variant="body2">{quantity}</Typography>
        </Grid>
        <Grid item size={4}>
          <Typography variant="body2">${totalPrice.toFixed(2)}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Grid container size={12} justifyContent="space-between">
        <Typography variant="body1" fontWeight="bold">
          Total:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          ${totalPrice.toFixed(2)}
        </Typography>
      </Grid>
    </Grid>
  );
}
