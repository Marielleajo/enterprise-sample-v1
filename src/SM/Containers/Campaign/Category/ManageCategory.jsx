import { Button, FormControl, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { withTranslation } from "react-i18next";
import * as Yup from "yup";

import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import {
  ADD_CampaignCategory,
  UPDATE_CampaignCategory,
} from "../../../../APIs/Campaign";

function ManageCategory({
  type,
  loading,
  setLoading,
  setManageAddCategory,
  setManageEditCategory,
  getAllCategories,
  selectedCategory,
}) {
  const { showSnackbar } = useSnackbar();

  const CategoryValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: type === "add" ? "" : selectedCategory?.name || "",
      description: type === "add" ? "" : selectedCategory?.description || "",
    },
    validationSchema: CategoryValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {
          Name: values.name,
          Description: values.description,
          languageCode: "en",
        };

        let response;
        if (type === "add") {
          response = await ADD_CampaignCategory(data);
        } else {
          response = await UPDATE_CampaignCategory(data, selectedCategory?.id);
        }

        if (response?.data?.success) {
          showSnackbar(response?.data?.message, "success");
          type === "add"
            ? setManageAddCategory(false)
            : setManageEditCategory(false);
          getAllCategories();
        } else {
          showSnackbar(response?.data?.message, "error");
          type === "add"
            ? setManageAddCategory(false)
            : setManageEditCategory(false);
          getAllCategories();
        }
      } catch (error) {
        showSnackbar(
          error?.response?.data?.message ||
            error?.response?.data?.errors?.Name?.[0] ||
            error?.response?.data?.result?.message,
          "error"
        );
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

        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="end"
          alignItems="center"
        >
          <Button
            type="submit"
            className="mui-btn primary filled"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageCategory);
