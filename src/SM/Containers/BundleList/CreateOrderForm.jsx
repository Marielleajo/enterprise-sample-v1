import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Grid2,
  Typography,
} from "@mui/material";

import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { CREATE_ORDER } from "../../../APIs/BundleListing";
import ReusableTextField from "../../../Components/ReusableTextField";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/utilFunctions";
import BundleCard from "./BundleCard";
import OrderSummary from "./OrderSummary";

export default function CreateOrderForm({ bundle, close }) {
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNumber: "",
      orderQuantity: 1,
      additionalNotes: "",
      bundleGuid: bundle?.recordGuid,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters")
        .optional(),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      mobileNumber: Yup.string()
        .matches(/^\d{8,15}$/, "Invalid mobile number")
        .optional(),
      orderQuantity: Yup.number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be greater than zero")
        .optional(),
      additionalNotes: Yup.string().optional(),
      quantity: Yup.number().optional(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = {
          ServiceTag: "ESIM",
          BundleGuid: values?.bundleGuid,
          Quantity: values?.orderQuantity,
          UniqueIdentifier: values?.email,
          AdditionalNotes: values?.additionalNotes,
          PhoneNumber: values?.mobileNumber,
          ClientName: values?.name,
        };

        let response = await CREATE_ORDER({ data });
        if (response?.data?.success) {
          close();
          showSnackbar("Order Created Successfully", "success");
        }
      } catch (e) {
        setLoading(false);
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-50">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      className="min-h-100 px-2"
      component="form"
      onSubmit={formik.handleSubmit}
    >
      <Grid2 container spacing={1}>
        {/* <Grid
          container
          spacing={2}
          size={{ xs: 12, sm: 12 }}
          sx={{
            backgroundColor: isDarkMode
              ? theme.palette.background.paper
              : theme.palette.background.default,
            borderRadius: "18px",
            padding: 4,
            fontWeight: 700,
          }}
        >
          <Grid item size={{ xs: 6, sm: 6 }}>
            <WalletIcon
              size="large"
              sx={{
                marginRight: 1,
              }}
            />
            Available Balance
          </Grid>
          <Grid item size={{ xs: 6, sm: 6 }} className="flex justify-end">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(selectedAccount?.currentBalance)}
          </Grid>
        </Grid> */}
        <Grid2 container size={{ xs: 12, sm: 12 }} spacing={2} className="mt-4">
          <Grid2 item size={{ xs: 12, sm: 12 }}>
            <Typography variant="p">Select Bundle</Typography>
          </Grid2>

          <Grid2 item size={{ xs: 12, sm: 12 }}>
            <BundleCard bundle={bundle} isSelected={true} />
          </Grid2>
        </Grid2>

        <Grid2 item size={{ xs: 12, sm: 4 }} className="mt-4">
          <ReusableTextField
            label="Email"
            name="email"
            type="email"
            InputLabelProps={{ shrink: true }}
            formik={formik}
          />
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 4 }} className="mt-4">
          <ReusableTextField
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            formik={formik}
            InputLabelProps={{ shrink: true }}
          />
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 4 }} className="mt-4">
          <ReusableTextField
            label="Customer Name"
            name="name"
            formik={formik}
            InputLabelProps={{ shrink: true }}
          />
        </Grid2>

        <OrderSummary bundle={bundle} quantity={1} />

        <Grid item size={{ xs: 12 }} className="Cancel_Save">
          <Button onClick={close} className="mui-btn primary outlined">
            cancel
          </Button>
          <Button type="submit" className="mui-btn primary filled">
            Create Order
          </Button>
        </Grid>
      </Grid2>
    </Box>
  );
}
