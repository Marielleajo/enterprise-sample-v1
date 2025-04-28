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

import {
  ADD_FREQUENCY,
  UPDATE_FREQUENCY
} from "../../../../APIs/EWallet";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";

function ManageFrequency({
  type,
  loading,
  setLoading,
  setManageAdd,
  setManageEdit,
  getAllFrequencies,
  selectedFrequency,
  categories,
  types,
}) {
  const { showSnackbar } = useSnackbar();

  const validationSchema = Yup.object({
    Name: Yup.string().required("Name is required"),
    CategoryId: Yup.string().required("Category is required"),
    TypeId: Yup.string().required("Type is required"),
    Interval: Yup.number()
      .min(0, "Interval must be at least 0")
      .required("Interval is required"),
  });

  const formik = useFormik({
    initialValues: {
      Name: type == "add" ? "" : selectedFrequency?.name || "",
      Interval: type === "add" ? "" : selectedFrequency?.interval || "",
      TypeId: type === "add" ? "" : selectedFrequency?.frequencyTypeGuid || "",
      CategoryId:
        type === "add" ? "" : selectedFrequency?.frequencyCategoryGuid || "",
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
          response = await ADD_FREQUENCY({ postData: data });
        } else {
          response = await UPDATE_FREQUENCY({
            postData: { RecordGuid: selectedFrequency.recordGuid, ...values },
          });
        }
        if (response?.data?.success) {
          if (type == "add") {
            showSnackbar("Frequency Added Successfully!");
            setManageAdd(false);
          } else {
            showSnackbar("Frequency Updated Successfully!");
            setManageEdit(false);
          }
          getAllFrequencies();
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
              key="Interval"
              id="Interval"
              name="Interval"
              label="Interval *"
              variant="standard"
              inputProps={{ step: "1", min: "0" }}
              type="number"
              value={formik.values.Interval}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.Interval && formik.errors.Interval}
              error={formik.touched.Interval && Boolean(formik.errors.Interval)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik.touched.CategoryId && Boolean(formik.errors.CategoryId)
            }
          >
            <InputLabel id="CategoryId-label">Category *</InputLabel>
            <Select
              key="CategoryId"
              id="CategoryId"
              name="CategoryId"
              label="CategoryId"
              labelId="CategoryId-label"
              onChange={(e) => {
                formik.setFieldValue("CategoryId", e.target.value);
              }}
              value={formik.values.CategoryId}
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
            {formik.touched.CategoryId && formik.errors.CategoryId && (
              <FormHelperText>{formik.errors.CategoryId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={formik.touched.TypeId && Boolean(formik.errors.TypeId)}
          >
            <InputLabel id="TypeId-label">Type *</InputLabel>
            <Select
              key="TypeId"
              id="TypeId"
              name="TypeId"
              label="TypeId"
              labelId="TypeId-label"
              onChange={(e) => {
                formik.setFieldValue("TypeId", e.target.value);
              }}
              value={formik.values.TypeId}
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
            {formik.touched.TypeId && formik.errors.TypeId && (
              <FormHelperText>{formik.errors.TypeId}</FormHelperText>
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

export default withTranslation("translations")(ManageFrequency);
