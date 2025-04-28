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
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import * as Yup from "yup";
//   import { ADD_INDUSTRY, UPDATE_INDUSTRY } from "../../../APIs/Industry";

import { ADD_DISCOUNT, UPDATE_DISCOUNT } from "../../../../APIs/EWallet";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";

function ManageDiscount({
  type,
  loading,
  setLoading,
  setManageAdd,
  setManageEdit,
  getAllDiscounts,
  selectedDiscount,
  categories,
  types,
  currencies,
}) {
  const { showSnackbar } = useSnackbar();

  const validationSchema = Yup.object({
    Name: Yup.string().required("Name is required"),
    Amount: Yup.number()
      .required("Amount is required")
      .min(0.01, "Amount must be greater than 0"),
    DiscountCategoryId: Yup.string().required("Discount Category is required"),
    DiscountTypeId: Yup.string().required("Discount Type is required"),
    CurrencyId: Yup.string().required("Currency is required"),
  });

  const formik = useFormik({
    initialValues: {
      Name: type == "add" ? "" : selectedDiscount?.name || "",
      Amount: type === "add" ? "" : selectedDiscount?.amount || "",
      DiscountTypeId:
        type === "add" ? "" : selectedDiscount?.discountTypeId || "",
      CurrencyId: type === "add" ? "" : selectedDiscount?.currencyId || "",
      DiscountCategoryId:
        type === "add" ? "" : selectedDiscount?.discountCategoryId || "",
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
          response = await ADD_DISCOUNT({ postData: data });
        } else {
          response = await UPDATE_DISCOUNT({
            postData: { RecordGuid: selectedDiscount.recordGuid, ...values },
          });
        }
        if (response?.data?.success) {
          if (type == "add") {
            showSnackbar("Discount Added Successfully!");
            setManageAdd(false);
          } else {
            showSnackbar("Discount Updated Successfully!");
            setManageEdit(false);
          }
          getAllDiscounts();
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  let selectedType = types.find(
    (type) => type.recordGuid === formik.values.DiscountTypeId
  );

  useEffect(() => {
    if (
      formik.values.Amount > 100 &&
      selectedType &&
      selectedType?.name === "Percentage Based"
    ) {
      formik.setFieldValue("Amount", "");
    }
  }, [formik.values.DiscountTypeId]);
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
              key="Amount"
              id="Amount"
              name="Amount"
              label="Amount *"
              inputProps={{
                step: "1",
                min: "0",
                max:
                  selectedType && selectedType?.name === "Percentage Based"
                    ? "100"
                    : undefined,
              }}
              varian
              variant="standard"
              type="number"
              value={formik.values.Amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.Amount && formik.errors.Amount}
              error={formik.touched.Amount && Boolean(formik.errors.Amount)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.DiscountCategoryId &&
              Boolean(formik.errors.DiscountCategoryId)
            }
          >
            <InputLabel id="DiscountCategoryId-label">
              Discount Category *
            </InputLabel>
            <Select
              key="DiscountCategoryId"
              id="DiscountCategoryId"
              name="DiscountCategoryId"
              label="DiscountCategoryId"
              labelId="DiscountCategoryId-label"
              onChange={(e) => {
                formik.setFieldValue("DiscountCategoryId", e.target.value);
              }}
              value={formik.values.DiscountCategoryId}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((country) => (
                <MenuItem key={country.recordGuid} value={country.recordGuid}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.DiscountCategoryId &&
              formik.errors.DiscountCategoryId && (
                <FormHelperText>
                  {formik.errors.DiscountCategoryId}
                </FormHelperText>
              )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.DiscountTypeId &&
              Boolean(formik.errors.DiscountTypeId)
            }
          >
            <InputLabel id="DiscountTypeId-label">Discount Type *</InputLabel>
            <Select
              key="DiscountTypeId"
              id="DiscountTypeId"
              name="DiscountTypeId"
              label="DiscountTypeId"
              labelId="DiscountTypeId-label"
              onChange={(e) => {
                formik.setFieldValue("DiscountTypeId", e.target.value);
              }}
              value={formik.values.DiscountTypeId}
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
            {formik.touched.DiscountTypeId && formik.errors.DiscountTypeId && (
              <FormHelperText>{formik.errors.DiscountTypeId}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.CurrencyId && Boolean(formik.errors.CurrencyId)
            }
          >
            <InputLabel id="CurrencyId-label">Currency *</InputLabel>
            <Select
              key="CurrencyId"
              id="CurrencyId"
              name="CurrencyId"
              label="CurrencyId"
              labelId="CurrencyId-label"
              onChange={(e) => {
                formik.setFieldValue("CurrencyId", e.target.value);
              }}
              value={formik.values.CurrencyId}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
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

export default withTranslation("translations")(ManageDiscount);
