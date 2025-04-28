import {
  Button,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { handleMessageError } from "../../Utils/Functions";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { useSelector } from "react-redux";
import { UPDATE_CURRENCY } from "../../../APIs/Currencies";
import { useFormik } from "formik";
import editValidationSchema from "./editValidation";

function ManageCurrencies({
  loading,
  setLoading,
  setManageEditCurrencies,
  getAllCurrencies,
  selectedCurrencies
}) {
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  
  const formik = useFormik({
    initialValues: {
      name: selectedCurrencies?.name || "",
      code: selectedCurrencies?.code || "",
      symbol: selectedCurrencies?.symbol || "",
      currencyEnum: selectedCurrencies?.currencyEnum || "",
    },
    validationSchema: editValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
     
      setLoading(true);
      try {
        const data = {
          ...selectedCurrencies,
          ...values,
        };
        const response = await UPDATE_CURRENCY({ token, data });

        if (response?.data?.success) {
          showSnackbar("Currency Updated Successfully!", "success");
          setManageEditCurrencies(false);
          getAllCurrencies();
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });


  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      formik.handleSubmit(e);
    }}>
      <Grid container>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="code"
              name="code"
              label="Code"
              variant="standard"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="symbol"
              name="symbol"
              label="Symbol"
              variant="standard"
              value={formik.values.symbol}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.symbol && Boolean(formik.errors.symbol)}
              helperText={formik.touched.symbol && formik.errors.symbol}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              id="currencyEnum"
              name="currencyEnum"
              label="CurrencyEnum *"
              variant="standard"
              value={formik.values.currencyEnum}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.currencyEnum && Boolean(formik.errors.currencyEnum)}
              helperText={formik.touched.currencyEnum && formik.errors.currencyEnum}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ marginTop: "20px" }}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="save-button"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageCurrencies);
