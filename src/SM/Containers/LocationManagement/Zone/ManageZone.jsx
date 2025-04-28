import {
  Button,
  FormControl,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { withTranslation } from "react-i18next";
import * as Yup from "yup";
import { ADD_Zone, UPDATE_Zone } from "../../../../APIs/Zone";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";

function ManageZone({
  type,
  loading,
  setLoading,
  setManageAddZone,
  setManageEditZone,
  getAllZones,
  selectedZone,
}) {
  const { showSnackbar } = useSnackbar();

  const ZoneValidationSchema = Yup.object({
    name: Yup.string().trim().required("Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: type === "add" ? "" : selectedZone?.name || "",
      isActive: type === "add" ? true : selectedZone?.isActive || false,
    },
    validationSchema: ZoneValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {
          Name: values.name,
          IsActive: values.isActive,
        };

        if (type === "edit") {
          data.RecordGuid = selectedZone.id;
        }

        let response;
        if (type === "add") {
          response = await ADD_Zone(data);
        } else {
          response = await UPDATE_Zone(data);
        }

        if (response?.data?.success) {
          if (type === "add") {
            showSnackbar(response?.data?.message, "success");
            setManageAddZone(false);
          } else {
            showSnackbar(response?.data?.message, "success");
            setManageEditZone(false);
          }
          getAllZones();
        }
      } catch (error) {
        showSnackbar(
          error?.response?.data?.message ||
            error?.response?.data?.Message ||
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
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isActive}
                onChange={(event) =>
                  formik.setFieldValue("isActive", event.target.checked)
                }
                name="isActive"
                color="primary"
              />
            }
            label={formik.values.isActive ? "Active" : "Inactive"}
          />
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
            id="add-Zone"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageZone);
