import { Button, FormControl, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { withTranslation } from "react-i18next";
import { ADD_NEW_CATEGORY, EDIT_CATEGORY } from "../../../APIs/Clients";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import addValidationSchema from "./addValidation";
import editValidationSchema from "./editValidation";

function ManageClientCategories({
  type,
  loading,
  setLoading,
  setManageAddClientCategory,
  getAllClientCategories,
  selectedClientCategory,
}) {
  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name:
        type == "add"
          ? ""
          : selectedClientCategory?.clientCategoryDetails[0]?.name,
      description:
        type == "add"
          ? ""
          : selectedClientCategory?.clientCategoryDetails[0]?.description,
    },
    validationSchema:
      type == "add" ? addValidationSchema : editValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            ClientCategoryDetails: [
              {
                LanguageCode: "en",
                Name: values?.name,
                Description: values?.description,
              },
            ],
          };

          let response = await ADD_NEW_CATEGORY({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Client Category Added Successfully!");
            setManageAddClientCategory(false);
            getAllClientCategories();
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
            RecordGuid: selectedClientCategory?.recordGuid,
            ClientCategoryDetails: [
              {
                LanguageCode: "en",
                Name: values?.name,
                Description: values?.description,
              },
            ],
          };

          let response = await EDIT_CATEGORY({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Client Category Updated Successfully!");
            setManageAddClientCategory(false);
            getAllClientCategories();
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
              label={"Name *"}
              variant="standard"
              type="text"
              value={formik?.values?.name}
              onChange={formik?.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              key={"description"}
              fullWidth
              id={"description"}
              name={"description"}
              label={"Description *"}
              variant="standard"
              type="text"
              value={formik?.values?.description}
              onChange={formik?.handleChange}
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

export default withTranslation("translations")(ManageClientCategories);
