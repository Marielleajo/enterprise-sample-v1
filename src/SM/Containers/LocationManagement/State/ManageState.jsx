import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { ADD_STATE, EDIT_STATE } from "../../../../APIs/Configuration";
import { GET_ACTIVE_COUNTRIES_API } from "../../../../APIs/Criteria";
import { handleMessageError } from "../../../Utils/Functions";

import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { addValidationSchema, editValidationSchema } from "./StateValidation";

function ManageState({
  type,
  loading,
  setLoading,
  setManageAddState,
  selectedOperator,
  SetData,
  getAllStates,
}) {
  const { showSnackbar } = useSnackbar();
  const [countries, SetCountries] = useState([]);

  const getDescriptionByLanguages = (
    details,
    primaryLangCode,
    secondaryLangCode
  ) => {
    const primaryDetail = details?.find(
      (detail) =>
        detail.languageCode?.toLowerCase() === primaryLangCode.toLowerCase()
    );

    const secondaryDetail = details?.find(
      (detail) =>
        detail.languageCode?.toLowerCase() === secondaryLangCode.toLowerCase()
    );

    return primaryDetail
      ? primaryDetail.description
      : secondaryDetail
      ? secondaryDetail.description
      : "";
  };
  const formik = useFormik({
    initialValues: {
      Name: type == "add" ? "" : selectedOperator?.name,
      country: "",
      description:
        type === "add"
          ? ""
          : getDescriptionByLanguages(selectedOperator?.details, "en", "fr"),
      isActive: type == "add" ? "" : selectedOperator?.isActive,
    },
    validationSchema:
      type == "add" ? addValidationSchema : editValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            Name: values?.Name || "",
            CountryGuid: values?.country.value || "",
            IsActive: values?.switchState,
            Details: [
              {
                name: values?.Name || "",
                Description: values?.description || "",
                LanguageCode: values?.languageCode || "EN",
              },
            ],
          };

          let response = await ADD_STATE({ postData: data });
          if (response?.data?.success) {
            showSnackbar("State Added Successfully!");
            setManageAddState(false);
            getAllStates();
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
            Name: values?.Name,
            IsActive: true,
            Details: [
              {
                name: values?.Name,
                Description: values?.description,
                LanguageCode: "en",
              },
            ],
            recordGuid: selectedOperator?.recordGuid,
          };

          let response = await EDIT_STATE({ postData: data });
          if (response?.data?.success) {
            showSnackbar("State Updated Successfully!");
            SetData((prevData) =>
              prevData.map((item) =>
                item.recordGuid === selectedOperator?.recordGuid
                  ? {
                      ...item,
                      name: values?.Name,
                      details: [
                        {
                          ...item.details?.[0],
                          name: values?.Name,
                          description: values?.description,
                          languageCode: "en",
                        },
                      ],
                    }
                  : item
              )
            );
            setManageAddState(false);
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
        {type == "add" && (
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <CustomAsyncPaginate
              apiFunction={GET_ACTIVE_COUNTRIES_API} // Pass the function directly
              value={formik.values.country}
              onChange={(value) => {
                formik.setFieldValue("country", value);
              }}
              placeholder="Country *"
              pageSize={10}
              dataPath="data.data.countries" // Adjust path based on API response structure
              totalRowsPath="data.data.totalRows"
              method="GET"
              id={`async-menu-style`}
            />
            {formik.touched.country && formik.errors.country && (
              <FormHelperText sx={{ color: "red" }} color="red">
                {formik.errors.country}
              </FormHelperText>
            )}
            {/* </FormControl> */}
          </Grid>
        )}
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"Name"}
              fullWidth
              id={"Name"}
              name={"Name"}
              label={" Name*"}
              variant="standard"
              type="text"
              value={formik?.values?.Name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Name && Boolean(formik.errors.Name)}
              helperText={formik.touched.Name && formik.errors.Name}
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
              label={" Description"}
              variant="standard"
              type="text"
              value={formik?.values?.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FormControl>
        </Grid>
        {type == "add" && (
          <Grid item xs={12} sx={{ marginTop: "20px" }}>
            <InputLabel id="country-label">Status</InputLabel>
            <FormControlLabel
              control={
                <>
                  <Switch
                    checked={formik?.values.switchState}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "switchState",
                        !formik?.values.switchState
                      );
                    }}
                  />
                </>
              }
              label={formik?.values.switchState ? "Active" : "Inactive"}
            />
          </Grid>
        )}

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

export default withTranslation("translations")(ManageState);
