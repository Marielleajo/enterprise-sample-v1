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
import React from "react";
import { withTranslation } from "react-i18next";
import * as Yup from "yup";
import { ADD_CHANNEL, UPDATE_CHANNEL } from "../../../APIs/Channels"; // Adjust the path as needed
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { useSelector } from "react-redux";

function ManageChannels({
  type,
  setLoading,
  fetchChannels,
  selectedChannel,
  handleClose,
}) {
  const { showSnackbar } = useSnackbar();

  const ChannelValidationSchema = Yup.object({
    name: Yup?.string()?.required("Name is required"),
    description: Yup?.string()?.required("Description is required"),
    languageCode: Yup?.string()?.required("Language Code is required"),
  });
  const { language } = useSelector((state) => state?.system);
  const languages = language?.map((item) => ({
    value: item?.code,
    label: item?.name,
  }));

  const formik = useFormik({
    initialValues: {
      name: type === "add" ? "" : selectedChannel?.name || "",
      description: type === "add" ? "" : selectedChannel?.description || "",
      languageCode:
        type === "add" ? "en" : selectedChannel?.languageCode || "en",
    },
    validationSchema: ChannelValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      let data = {
        details: [
          {
            name: values?.name,
            description: values?.description,
            languageCode: values?.languageCode,
          },
        ],
      };
      try {
        let response;
        if (type === "add") {
          response = await ADD_CHANNEL(data);
        } else {
          response = await UPDATE_CHANNEL(selectedChannel?.recordGuid, data);
        }
        if (response?.data) {
          showSnackbar(
            type === "add"
              ? "Channel added successfully!"
              : "Channel updated successfully!",
            "success"
          );
        } else {
          showSnackbar("Operation failed", "error");
        }
        fetchChannels();
        handleClose();
      } catch (error) {
        showSnackbar("Failed to perform operation", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={formik.touched.name && Boolean(formik.errors.name)}
          >
            <TextField
              id="name"
              name="name"
              label="Name *"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.name && formik.errors.name}
              error={formik.touched.name && formik.errors.name}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
          >
            <TextField
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
              error={formik.touched.description && formik.errors.description}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={
              formik.touched.languageCode && Boolean(formik.errors.languageCode)
            }
            variant="standard"
          >
            <InputLabel>Language Code</InputLabel>
            <Select
              name="languageCode"
              value={formik.values.languageCode}
              onChange={formik.handleChange}
              label="Language Code"
            >
              {languages?.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.languageCode && formik.errors.languageCode}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="end">
          <Button
            type="submit"
            className="mui-btn primary filled"
            disabled={formik.isSubmitting}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageChannels);
