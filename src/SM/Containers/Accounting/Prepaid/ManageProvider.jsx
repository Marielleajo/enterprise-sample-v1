import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import { GET_ALL_PROVIDER_API, POST_PROVIDER } from "../../../../APIs/Prepaid";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

const addValidation = Yup.object().shape({
  provider: Yup.object().required("Provider is required"),
});

export default function ManageProvider({
  getAllPostpaid,
  setmanageAddPostpaid,
}) {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      provider: "",
    },
    validationSchema: addValidation,
    onSubmit: async (values) => {
      const payload = {
        ProviderGuids: values.provider.value,
        BalanceLimit: values.balanceLimit,
      };
      setLoading(true);
      try {
        let response = await POST_PROVIDER({ postData: payload });
        if (response?.data?.success) {
          getAllPostpaid();
          showSnackbar(response?.data?.message);
          setmanageAddPostpaid(false);
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomAsyncPaginate
            apiFunction={GET_ALL_PROVIDER_API}
            value={formik.values.provider}
            onChange={(value) => {
              formik.setFieldValue("provider", value);
            }}
            placeholder="Providers"
            pageSize={10}
            dataPath="data.data.providers"
            totalRowsPath="data.data.totalRows"
            method="POST"
            id={`async-menu-style`}
          />
          {formik.touched.provider && formik.errors.provider && (
            <FormHelperText style={{ color: theme?.palette?.error?.main }}>
              {formik.errors.provider}
            </FormHelperText>
          )}
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
