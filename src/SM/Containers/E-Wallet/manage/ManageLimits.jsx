import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Formik, useFormik } from "formik";
import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import * as Yup from "yup";

import { ADD_LIMIT, UPDATE_LIMIT } from "../../../../APIs/EWallet";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";

function ManageLimits({
  type,
  loading,
  setLoading,
  setManageAdd,
  setManageEdit,
  getAllLimits,
  selectedLimit,
  categories,
  types,
  currencies,
  accountTypes,
  frequencies,
}) {
  const { showSnackbar } = useSnackbar();

  const validationSchema = Yup.object({
    Name: Yup.string().required("Name is required"),
    LimitAmount: Yup.number()
      .required("Limit Amount is required")
      .min(0.01, "Limit Amount must be greater than 0"),
    FrequencyGuid: Yup.string().required("Frequency is required"),
    LimitTypeGuid: Yup.string().required("Type is required"),
    LimitCategoryGuid: Yup.string().required("Category is required"),
    AccountTypeGuid: Yup.string().required("Account Type is required"),
    CurrencyId: Yup.string().required("Currency is required"),
  });

  const formik = useFormik({
    initialValues: {
      Name: type == "add" ? "" : selectedLimit?.name || "",
      LimitAmount: type === "add" ? "" : selectedLimit?.limitAmount || "",
      FrequencyGuid: type === "add" ? "" : selectedLimit?.frequencyGuid || "",
      LimitTypeGuid: type === "add" ? "" : selectedLimit?.limitTypeGuid || "",
      LimitCategoryGuid:
        type === "add" ? "" : selectedLimit?.limitCategoryGuid || "",
      AccountTypeGuid:
        type === "add" ? "" : selectedLimit?.accountTypeGuid || "",
      CurrencyId:
        type === "add" ? "" : selectedLimit?.currency?.recordGuid || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {
          ...values,
        };

        let response;
        if (type == "add") {
          response = await ADD_LIMIT({ postData: data });
        } else {
          response = await UPDATE_LIMIT({
            postData: { RecordGuid: selectedLimit.recordGuid, ...values },
          });
        }
        if (response?.data?.success) {
          if (type == "add") {
            showSnackbar("Limit Added Successfully!");
            setManageAdd(false);
          } else {
            showSnackbar("Limit Updated Successfully!");
            setManageEdit(false);
          }
          getAllLimits();
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });
  let selectedType = types.find(
    (type) => type.recordGuid === formik.values.LimitTypeGuid
  );

  useEffect(() => {
    if (
      formik.values.LimitAmount > 100 &&
      selectedType &&
      selectedType?.name === "Percentage"
    ) {
      formik.setFieldValue("LimitAmount", "");
    }
  }, [formik.values.LimitTypeGuid]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="Name"
              id="Name"
              name="Name"
              label="Name *"
              variant="standard"
              value={formik.values.Name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.Name && formik.errors.Name}
              error={formik.touched.Name && Boolean(formik.errors.Name)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="LimitAmount"
              id="LimitAmount"
              name="LimitAmount"
              label="Limit Amount *"
              inputProps={{
                step: "1",
                min: "0",
                max:
                  selectedType && selectedType?.name === "Percentage"
                    ? "100"
                    : undefined,
              }}
              variant="standard"
              type="number"
              value={formik.values.LimitAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.LimitAmount && formik.errors.LimitAmount
              }
              error={
                formik.touched.LimitAmount && Boolean(formik.errors.LimitAmount)
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.FrequencyGuid &&
              Boolean(formik.errors.FrequencyGuid)
            }
          >
            <InputLabel id="FrequencyGuid-label">Frequency *</InputLabel>
            <Select
              key="FrequencyGuid"
              id="FrequencyGuid"
              name="FrequencyGuid"
              label="FrequencyGuid"
              labelId="FrequencyGuid-label"
              onChange={(e) => {
                formik.setFieldValue("FrequencyGuid", e.target.value);
              }}
              value={formik.values.FrequencyGuid}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {frequencies.map((option) => (
                <MenuItem key={option.recordGuid} value={option.recordGuid}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.FrequencyGuid && formik.errors.FrequencyGuid && (
              <FormHelperText>{formik.errors.FrequencyGuid}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.LimitCategoryGuid &&
              Boolean(formik.errors.LimitCategoryGuid)
            }
          >
            <InputLabel id="LimitCategoryGuid-label">Category *</InputLabel>
            <Select
              key="LimitCategoryGuid"
              id="LimitCategoryGuid"
              name="LimitCategoryGuid"
              label="LimitCategoryGuid"
              labelId="LimitCategoryGuid-label"
              onChange={(e) => {
                formik.setFieldValue("LimitCategoryGuid", e.target.value);
              }}
              value={formik.values.LimitCategoryGuid}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((option) => (
                <MenuItem key={option.recordGuid} value={option.recordGuid}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.LimitCategoryGuid &&
              formik.errors.LimitCategoryGuid && (
                <FormHelperText>
                  {formik.errors.LimitCategoryGuid}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            sx={{ m: 0 }}
            id="CurrencyId"
            name="CurrencyId"
            error={
              formik.touched["CurrencyId"] &&
              Boolean(formik.errors["CurrencyId"])
            }
            helperText={
              formik.touched["CurrencyId"] && formik.errors["CurrencyId"]
            }
          >
            <InputLabel id="demo-simple-select-standard-label">
              Currency *
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="CurrencyId"
              name="CurrencyId"
              onChange={(e) => {
                formik.setFieldValue("CurrencyId", e.target.value);
              }}
              value={formik.values.CurrencyId}
              label="Source Currency"
              error={
                formik.touched["CurrencyId"] &&
                Boolean(formik.errors["CurrencyId"])
              }
              helperText={
                formik.touched["CurrencyId"] && formik.errors["CurrencyId"]
              }
            >
              {currencies.map((option, index) => (
                <MenuItem key={index} value={option?.recordGuid}>
                  {option?.tag}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.CurrencyId && formik.errors.CurrencyId && (
              <FormHelperText>{formik.errors.CurrencyId}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.LimitTypeGuid &&
              Boolean(formik.errors.LimitTypeGuid)
            }
          >
            <InputLabel id="LimitTypeGuid-label">Type *</InputLabel>
            <Select
              key="LimitTypeGuid"
              id="LimitTypeGuid"
              name="LimitTypeGuid"
              label="LimitTypeGuid"
              labelId="LimitTypeGuid-label"
              onChange={(e) => {
                formik.setFieldValue("LimitTypeGuid", e.target.value);
              }}
              value={formik.values.LimitTypeGuid}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {types.map((option) => (
                <MenuItem key={option.recordGuid} value={option.recordGuid}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.LimitTypeGuid && formik.errors.LimitTypeGuid && (
              <FormHelperText>{formik.errors.LimitTypeGuid}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.AccountTypeGuid &&
              Boolean(formik.errors.AccountTypeGuid)
            }
          >
            <InputLabel id="AccountTypeGuid-label">Account Type *</InputLabel>
            <Select
              key="AccountTypeGuid"
              id="AccountTypeGuid"
              name="AccountTypeGuid"
              label="AccountTypeGuid"
              labelId="AccountTypeGuid-label"
              onChange={(e) => {
                formik.setFieldValue("AccountTypeGuid", e.target.value);
              }}
              value={formik.values.AccountTypeGuid}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {accountTypes.map((option, index) => (
                <MenuItem key={index} value={option?.recordGuid}>
                  {option?.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.AccountTypeGuid &&
              formik.errors.AccountTypeGuid && (
                <FormHelperText>{formik.errors.AccountTypeGuid}</FormHelperText>
              )}
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ marginTop: "10px" }}
          display="flex"
          justifyContent="end"
          alignItems="center"
        >
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="add-Industry"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageLimits);
