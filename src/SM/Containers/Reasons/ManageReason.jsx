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
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { AsyncPaginate } from "react-select-async-paginate";
import * as Yup from "yup";

const ManageReason = ({
  type,
  loading,
  selectedReason,
  onADD,
  onEdit,
  reasonTypes,
  loadReasonTypesOptions,
}) => {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    setLanguages([{ value: "en", label: "English" }]);
    if (type == "edit") {
      loadReasonTypesOptions("", [], { page: 0 });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      languageCode:
        type === "add"
          ? ""
          : selectedReason?.reasonDetails[0]?.languageCode || "",
      description:
        type === "add"
          ? ""
          : selectedReason?.reasonDetails[0]?.description || "",
      ReasontypeGuid:
        reasonTypes
          ?.filter((item) => item?.recordGuid == selectedReason?.reasonTypeGuid)
          ?.map((item) => ({
            label: item?.reasonTypeDetails[0]?.name,
            value: item?.recordGuid,
          }))[0] || "",
    },
    validationSchema: Yup.object().shape({
      languageCode: Yup.string().required("Language Code is required"),
      description: Yup.string().required("Description is required"),
      ReasontypeGuid: Yup.object().required("Reason Type is required"),
    }),
    onSubmit: async (values) => {
      const reason = {
        ReasontypeGuid: values.ReasontypeGuid?.value,
        reasonDetails: [
          {
            languageCode: values.languageCode,
            description: values.description,
          },
        ],
      };
      if (type === "add") {
        await onADD(reason);
      } else {
        await onEdit(reason);
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
              formik?.touched?.languageCode &&
              Boolean(formik?.errors?.languageCode)
            }
            variant="standard"
          >
            <InputLabel>Language Code</InputLabel>
            <Select
              name="languageCode"
              value={formik?.values?.languageCode}
              onChange={formik?.handleChange}
              label="Language Code"
            >
              {languages?.map((lang) => (
                <MenuItem key={lang?.value} value={lang?.value}>
                  {lang?.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik?.touched?.languageCode && formik?.errors?.languageCode}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="standard"
            fullWidth
            name="description"
            label="Description"
            value={formik?.values?.description}
            onChange={formik?.handleChange}
            error={
              formik?.touched?.description &&
              Boolean(formik?.errors?.description)
            }
            helperText={
              formik?.touched?.description && formik?.errors?.description
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={
              formik?.touched?.ReasontypeGuid &&
              Boolean(formik?.errors?.ReasontypeGuid)
            }
            variant="standard"
          >
            {formik?.values?.ReasontypeGuid != "" &&
            formik?.values?.ReasontypeGuid != undefined ? (
              <InputLabel
                error={
                  formik?.touched?.ReasontypeGuid &&
                  Boolean(formik?.errors?.ReasontypeGuid)
                }
                sx={{ fontSize: "12px", top: "-25px" }}
              >
                Reason Type
              </InputLabel>
            ) : (
              <InputLabel sx={{ marginTop: "10px" }} />
            )}
            <AsyncPaginate
              id="async-menu-style"
              value={formik?.values?.ReasontypeGuid}
              loadOptions={loadReasonTypesOptions}
              onChange={(value) =>
                formik?.setFieldValue("ReasontypeGuid", value)
              }
              additional={{
                page: 1,
              }}
              placeholder={"Reason Type"}
              classNamePrefix="react-select"
            />
            <FormHelperText>
              {formik?.touched?.ReasontypeGuid &&
                formik?.errors?.ReasontypeGuid}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            className="mui-btn primary filled"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {type === "add" ? "Add Reason" : "Edit Reason"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default withTranslation("translations")(ManageReason);
