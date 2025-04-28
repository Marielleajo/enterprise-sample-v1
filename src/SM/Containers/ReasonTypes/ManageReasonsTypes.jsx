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
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const addValidationSchema = Yup.object().shape({
  languageCode: Yup.string().required("Language Code is required"),
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

function ManageReasonsTypes({
  type,
  loading,
  selectedReasonType,
  onADD,
  onEdit,
}) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    setLanguages([{ value: "en", label: "English" }]);
  }, []);

  const formik = useFormik({
    initialValues: {
      languageCode:
        type === "add"
          ? ""
          : selectedReasonType?.reasonTypeDetails[0]?.languageCode || "",
      name:
        type === "add"
          ? ""
          : selectedReasonType?.reasonTypeDetails[0]?.name || "",
      description:
        type === "add"
          ? ""
          : selectedReasonType?.reasonTypeDetails[0]?.description || "",
    },
    validationSchema: addValidationSchema,
    onSubmit: async (values) => {
      if (type === "add") {
        await onADD(values);
      } else {
        await onEdit(values);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
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
              {languages.map((lang) => (
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
        <Grid item xs={12}>
          <TextField
            variant="standard"
            fullWidth
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="standard"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            className="mui-btn primary filled"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {type === "add" ? "Add Reason Type" : "Edit Reason Type"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageReasonsTypes);
