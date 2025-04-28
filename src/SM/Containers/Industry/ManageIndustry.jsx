import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { withTranslation } from "react-i18next";
import * as Yup from "yup";
import { ADD_INDUSTRY, UPDATE_INDUSTRY } from "../../../APIs/Industry";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import { useSelector } from "react-redux";

function ManageIndustry({
  type,
  loading,
  setLoading,
  setManageAddIndustry,
  setManageEditIndustry,
  getAllIndustries,
  selectedIndustry,
}) {
  const { showSnackbar } = useSnackbar();

  const { language } = useSelector((state) => state?.system);
  const IndustryValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    languageCode: Yup.string().required("Language Code is required"),
  });

  const languages = language?.map((item) => ({
    value: item?.code,
    label: item?.name,
  }));

  const formik = useFormik({
    initialValues: {
      name: type == "add" ? "" : selectedIndustry?.name || "",
      description: type === "add" ? "" : selectedIndustry?.description || "",
      languageCode:
        type == "add" ? "en" : selectedIndustry?.languageCode || "en",
    },
    validationSchema: IndustryValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {
          details: [
            {
              name: values?.name,
              description: values?.description,
              languageCode: values?.languageCode,
            },
          ],
        };
        let response;
        if (type == "add") {
          response = await ADD_INDUSTRY(data);
        } else {
          response = await UPDATE_INDUSTRY(selectedIndustry?.id, data);
        }
        if (response?.data?.success) {
          if (type == "add") {
            showSnackbar("Industry Added Successfully!");
            setManageAddIndustry(false);
          } else {
            showSnackbar("Industry Updated Successfully!");
            setManageEditIndustry(false);
          }
          getAllIndustries();
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
          <FormControl fullWidth variant="standard">
            <TextField
              key="name"
              id="name"
              name="name"
              label="Name *"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.name && formik.errors.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="standard">
            <TextField
              key="description"
              id="description"
              name="description"
              label="Description *"
              variant="standard"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.description && formik.errors.description
              }
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.languageCode && Boolean(formik.errors.languageCode)
            }
          >
            <InputLabel id="languageCode-label">Language Code *</InputLabel>
            <Select
              labelId="languageCode-label"
              id="languageCode"
              name="languageCode"
              value={formik.values.languageCode}
              onChange={formik.handleChange}
            >
              {languages?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.languageCode && formik.errors.languageCode ? (
              <div>{formik.errors.languageCode}</div>
            ) : null}
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ marginTop: "20px" }}
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

export default withTranslation("translations")(ManageIndustry);
