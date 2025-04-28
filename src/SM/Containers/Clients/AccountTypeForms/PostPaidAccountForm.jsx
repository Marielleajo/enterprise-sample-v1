import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
import { POST_CLIENTS } from "../../../../APIs/Postpaid";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import * as Yup from "yup";

const addValidation = Yup.object().shape({

  balanceLimit: Yup.string()
    .required("Balance Limit is required")
    .typeError("Balance Limit must be a number"),
});
export default function PostPaidAccountForm({
  client,
  reseller,
  valueThreshold,
  getNoAccountClients,
  handelCloseModal,
}) {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const [unlimetedBalance, setUnlimetedBalance] = useState(false);
  const formik = useFormik({
    initialValues: {
      reseller: reseller,
      client: client,
      threshold: "",
      balanceLimit: "",
    },
    validationSchema: addValidation,
    onSubmit: async (values) => {
      const payload = {
        ClientGuid: values?.client?.recordGuid,
        BalanceLimit: values?.balanceLimit,
      };
      setLoading(true);
      try {
        let response = await POST_CLIENTS({ postData: payload });
        if (response?.data?.success) {
          getNoAccountClients();
          showSnackbar(response?.data?.message);
          handelCloseModal();
        } else {
          showSnackbar(response?.data?.message);
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });
  const handleNumberChange = (e) => {
    let value = e.target.value;

    // If the value is empty or just a negative sign, allow it
    if (value === "" || value === "-") {
      formik.setFieldValue("balanceLimit", value);
      return;
    }

    // Ensure the value starts with a negative sign and follows the number pattern
    if (/^-?\d*\.?\d*$/.test(value)) {
      if (!value.startsWith("-")) {
        value = `-${value}`;
      }
      formik.setFieldValue("balanceLimit", value);
    }
  };
  useEffect(() => {
    if (
      formik.values.balanceLimit &&
      !isNaN(formik.values.balanceLimit) &&
      !unlimetedBalance
    ) {
      const thresholdValue = (
        parseFloat(formik.values.balanceLimit) *
        (valueThreshold / 100)
      ).toFixed(2);
      formik.setFieldValue("threshold", thresholdValue);
    } else {
      formik.setFieldValue("threshold", "");
    }
  }, [formik.values.balanceLimit, valueThreshold, unlimetedBalance]);
  useEffect(() => {
    if (unlimetedBalance) {
      formik.setValues({
        ...formik.values,
        balanceLimit: -1,
        threshold: -0.85,
      });
    } else {
      formik.setValues({
        ...formik.values,
        balanceLimit: "",
        threshold: "",
      });
    }
  }, [unlimetedBalance]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="reseller"
              id="reseller"
              name="reseller"
              label="Reseller"
              variant="standard"
              value={formik.values.reseller.name}
              disabled={true}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="client"
              id="client"
              name="client"
              label="Client"
              variant="standard"
              value={formik.values.client.name}
              disabled={true}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"balanceLimit"}
              fullWidth
              id={"balanceLimit"}
              name={"balanceLimit"}
              label={"Balance Limit"}
              variant="standard"
              type="text"
              value={formik.values.balanceLimit}
              onChange={handleNumberChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.balanceLimit &&
                Boolean(formik.errors.balanceLimit)
              }
              helperText={
                formik.touched.balanceLimit && formik.errors.balanceLimit
              }
              disabled={unlimetedBalance}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"threshold"}
              fullWidth
              id={"threshold"}
              name={"threshold"}
              label={`Threshold ${valueThreshold}%`}
              variant="standard"
              type="text"
              value={formik.values.threshold}
              onBlur={formik.handleBlur}
              error={
                formik.touched.threshold && Boolean(formik.errors.threshold)
              }
              helperText={formik.touched.threshold && formik.errors.threshold}
              disabled
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControlLabel
            control={
              <Switch
                checked={unlimetedBalance}
                onChange={() => setUnlimetedBalance(!unlimetedBalance)}
              />
            }
            label="Unlimited balance"
          />
        </Grid>
        {/* <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            disabled={!formik.values.reseller}
          >
            <InputLabel
              id="client-label"
              error={
                formik.touched["client"] && Boolean(formik.errors["client"])
              }
            >
              Client
            </InputLabel>
            <Select
              key="client"
              id="client"
              name="client"
              label="client"
              labelId="client-label"
              value={formik.values.client}
              onChange={formik.handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {clientOptions?.map((item) => (
                <MenuItem key={item?.value} value={item?.value}>
                  {item?.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formik.touched.client && formik.errors.client && (
            <FormHelperText style={{ color: theme?.palette?.error?.main }}>
              {formik.errors.client}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"balanceLimit"}
              fullWidth
              id={"balanceLimit"}
              name={"balanceLimit"}
              label={"Balance Limit"}
              variant="standard"
              type="text"
              value={formik.values.balanceLimit}
              onChange={handleNumberChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.balanceLimit &&
                Boolean(formik.errors.balanceLimit)
              }
              helperText={
                formik.touched.balanceLimit && formik.errors.balanceLimit
              }
              disabled={unlimetedBalance}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"threshold"}
              fullWidth
              id={"threshold"}
              name={"threshold"}
              label={`Threshold ${valueThreshold}%`}
              variant="standard"
              type="text"
              value={formik.values.threshold}
              onBlur={formik.handleBlur}
              error={
                formik.touched.threshold && Boolean(formik.errors.threshold)
              }
              helperText={formik.touched.threshold && formik.errors.threshold}
              disabled
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControlLabel
            control={
              <Switch
                checked={unlimetedBalance}
                onChange={() => setUnlimetedBalance(!unlimetedBalance)}
              />
            }
            label="Unlimited balance"
          />
        </Grid> */}
        <Grid
          item
          xs={12}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="send-service-provider-id"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
