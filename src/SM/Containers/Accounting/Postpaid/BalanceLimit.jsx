import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { UPDATE_BALANCE_CLIENT, UPDATE_BALANCE_PROVIDER } from "../../../../APIs/Postpaid";
import { handleMessageError } from "../../../Utils/Functions";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";

const addValidation = Yup.object().shape({
  balanceLimit: Yup.number()
    .required("Balance Limit is required")
    .typeError("Balance Limit must be a number"),
});

export default function ManageProvider({
  selectedRow,
  getAllPostpaid,
  setManageSetNewLimit,
  type
}) {
  const [loading, setLoading] = useState(false);
  const [unlimetedBalance, setUnlimetedBalance] = useState(false);
  const { showSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      currency: selectedRow?.currencyCode,
      balanceLimit: selectedRow?.balanceLimit,
    },
    validationSchema: addValidation,
    onSubmit: async (values) => {
      const payload = {
        NewBalanceLimit: values.balanceLimit,
      };
      if (type === 'provider') {
        payload.ProviderAccountGuid = selectedRow?.recordGuid;
      } else {
        payload.ClientAccountGuid = selectedRow?.recordGuid;
      }
      setLoading(true);
      try {
        let response;
        if (type === 'provider') {
          response = await UPDATE_BALANCE_PROVIDER({ postData: payload });
        } else {
          response = await UPDATE_BALANCE_CLIENT({ postData: payload });
        }
        if (response?.data?.success) {
          showSnackbar("Balance Limit updated successfully!", "success");
          setManageSetNewLimit(false);
          getAllPostpaid();
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
    if (selectedRow) {
      setUnlimetedBalance(selectedRow?.unlimetedBalance);
    }
  }, [selectedRow]);

  useEffect(() => {
    if (unlimetedBalance) {
      formik.setFieldValue("balanceLimit", -1);
    } else {
      formik.setFieldValue("balanceLimit", selectedRow?.balanceLimit);
    }
  }, [unlimetedBalance]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={10} md={8}>
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
              disabled={unlimetedBalance} // Disable the TextField when the checkbox is checked
            />
          </FormControl>
        </Grid>
        <Grid item xs={2} md={4}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"currency"}
              fullWidth
              id={"currency"}
              name={"currency"}
              label={"Currency"}
              variant="standard"
              type="text"
              value={formik.values.currency}
              onBlur={formik.handleBlur}
              error={formik.touched.currency && Boolean(formik.errors.currency)}
              helperText={formik.touched.currency && formik.errors.currency}
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
