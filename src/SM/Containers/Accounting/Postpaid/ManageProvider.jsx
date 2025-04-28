import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import { GET_ALL_PROVIDER_API, POST_PROVIDER } from "../../../../APIs/Postpaid";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

export default function ManageProvider({
  getAllPostpaid,
  setmanageAddPostpaid,
  valueThreshold,
}) {
  const [providerOptions, setproviderOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [randomValue, setRandomValue] = useState("");
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const [unlimetedBalance, setUnlimetedBalance] = useState(false);

  const addValidation = Yup.object().shape({
    provider: Yup.object().required("Provider is required"),
    balanceLimit: Yup.number()
      .required("Balance Limit is required")
      .typeError("Balance Limit must be a number"),
    threshold: unlimetedBalance
      ? Yup.number()
      : Yup.number()
          .required("Threshold is required")
          .typeError("Threshold must be a number"),
  });
  const formik = useFormik({
    initialValues: {
      provider: "",
      threshold: "",
      balanceLimit: "",
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

  // const getAllprovider = async () => {
  //   const postData = {
  //     pageIndex: 1,
  //     pageSize: 500,
  //     search: "",
  //     typeTag: "",
  //   };
  //   setLoading(true);
  //   try {
  //     let response = await GET_ALL_PROVIDER_API({ postData: postData });
  //     const options = response?.data?.data?.providers?.map((item) => ({
  //       value: item?.recordGuid,
  //       label: item?.name,
  //     }));
  //     setproviderOptions(options);
  //   } catch (e) {
  //     showSnackbar(handleMessageError({ e, type: "validation" }), "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // useEffect(() => {
  //   getAllprovider();
  // }, []);

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

  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const postData = {
        pageIndex: 1,
        pageSize: 500,
        Name: search,
        typeTag: "",
      };
      let response = await GET_ALL_PROVIDER_API({ postData });

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.clients?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.providers?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };

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
