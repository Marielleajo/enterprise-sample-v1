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
import { ADD_DOWN_PAYMENT_CLIENT, ADD_DOWN_PAYMENT_PROVIDER } from "../../../../APIs/Postpaid";
import { handleMessageError } from "../../../Utils/Functions";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";

const addValidation = Yup.object().shape({
  downPayment: Yup.number()
    .required("Dow Payment is required")
    .typeError("Dow Payment must be a number"),
});

export default function ManageProvider({
  getAllPostpaid,
  setManageDownPayment,
  selectedRow,
  type
}) {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      downPayment: "",
    },
    validationSchema: addValidation,
    onSubmit: async (values) => {
      const payload = {
        DownPaymentAmount: values.downPayment,
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
          response = await ADD_DOWN_PAYMENT_PROVIDER({ postData: payload });
        } else {
          response = await ADD_DOWN_PAYMENT_CLIENT({ postData: payload });
        }
        
        if (response?.data?.success) {
          showSnackbar("Down payment added successfully!", "success");
          setManageDownPayment(false);
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
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("downPayment", value);
    }
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"downPayment"}
              fullWidth
              id={"downPayment"}
              name={"downPayment"}
              label={"Payment"}
              variant="standard"
              type="text"
              value={formik.values.downPayment}
              onChange={handleNumberChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.downPayment && Boolean(formik.errors.downPayment)
              }
              helperText={
                formik.touched.downPayment && formik.errors.downPayment
              }
            />
          </FormControl>
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
