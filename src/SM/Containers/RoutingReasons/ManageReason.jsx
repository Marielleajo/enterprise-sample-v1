import { Button, FormControl, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { withTranslation } from "react-i18next";
import { ADD_ROUTING_REASON, EDIT_ROUTING_REASON } from "../../../APIs/Reasons";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import AddEditValidationSchema from "./ReasonValidation";

function ManageReason({
  type,
  loading,
  setLoading,
  setManageAddReason,
  getAllReasons,
  selectedReason,
  ReasonTag,
}) {
  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name: type == "add" ? "" : selectedReason?.name,
      description: type == "add" ? "" : selectedReason?.description,
    },
    validationSchema: AddEditValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            name: values?.name,
            CriteriaCategoryTag: ReasonTag,
            isEditable: true,
            details: [
              {
                name: values?.name,
                languageCode: "en",
                description: values?.description,
              },
            ],
          };

          let response = await ADD_ROUTING_REASON({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Reason Added Successfully!");
            setManageAddReason(false);
            getAllReasons(ReasonTag);
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          let data = {
            criteriaGuid: selectedReason?.recordGuid,
            name: values?.name,
            isEditable: true,
            CriteriaCategoryTag: ReasonTag,
            details: [
              {
                name: values?.name,
                languageCode: "en",
                description: values?.description,
              },
            ],
          };

          let response = await EDIT_ROUTING_REASON({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Reason Updated Successfully!");
            setManageAddReason(false);
            getAllReasons(ReasonTag);
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      }
    },
  });

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"name"}
              fullWidth
              id={"name"}
              name={"name"}
              label={"Reason*"}
              variant="standard"
              type="text"
              value={formik?.values?.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"description"}
              fullWidth
              id={"description"}
              name={"description"}
              label={"Description"}
              variant="standard"
              type="text"
              value={formik?.values?.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ marginTop: "20px" }}
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

export default withTranslation("translations")(ManageReason);
