import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  ADD_CITY,
  EDIT_CITY,
  GET_ALL_DISTRICT,
  GET_ALL_STATE,
} from "../../../../APIs/Configuration";
import {
  GET_ACTIVE_COUNTRIES_API,
  GET_ALL_COUNTRIES_API,
} from "../../../../APIs/Criteria";
import { handleMessageError } from "../../../Utils/Functions";
import Notification from "../../../../Components/Notification/Notification";

import { useSelector } from "react-redux";
import { getIsoCodeByRecordGuid } from "../helper";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {
  addCityValidationSchema,
  editCityValidationSchema,
} from "./CityValidationSchema";

function ManageState({
  type,
  loading,
  setLoading,
  setManageAddState,
  getAllOperators,
  selectedOperator,
}) {
  const { showSnackbar } = useSnackbar();
  const [countries, SetCountries] = useState([]);
  const [states, SetStates] = useState([]);
  const [district, SetDistrict] = useState([]);
  const { token } = useSelector((state) => state.authentication);
  const [countryISO, setCountryISO] = useState("");
  const [randomValue, setRandomValue] = useState(null);

  // Get all countries
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ACTIVE_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };
  // const GetAllStates = async () => {
  //   try {
  //     let stateResp = await GET_ALL_STATE({
  //       token,
  //       pageSize: 100,
  //       CountryIso: countryISO,
  //     });
  //     SetStates(stateResp?.data?.data?.locations);
  //   } catch (e) {
  //     Notification.error(e);
  //   }
  // };
  // const GetAllDistrict = async () => {
  //   try {
  //     let districtRes = await GET_ALL_DISTRICT({
  //       token,
  //       pageSize: 100,
  //       CountryIso: countryISO,
  //     });

  //     SetDistrict(districtRes?.data?.data?.locations);
  //   } catch (e) {
  //     Notification.error(e);
  //   }
  // };

  const getDescriptionByLanguages = (
    details,
    primaryLangCode,
    secondaryLangCode
  ) => {
    // Try to find the description in the primary language (en)
    const primaryDetail = details?.find(
      (detail) =>
        detail.languageCode?.toLowerCase() === primaryLangCode.toLowerCase()
    );

    // If not found, try the secondary language (fr)
    const secondaryDetail = details?.find(
      (detail) =>
        detail.languageCode?.toLowerCase() === secondaryLangCode.toLowerCase()
    );

    // Return the primary description if available, otherwise fall back to the secondary
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
      isActive: type == "add" ? true : selectedOperator?.isActive,
      // parentGuid: "",
    },
    validationSchema:
      type == "add" ? addCityValidationSchema : editCityValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            Name: values?.Name || "",
            CountryGuid: values?.country || "",
            IsActive: values?.switchState,
            // ParentGuid: values?.parentGuid,
            Details: [
              {
                name: values?.Name || "",
                Description: values?.description || "",
                LanguageCode: values?.languageCode || "EN", // Default to "EN" if not provided
              },
            ],
          };

          let response = await ADD_CITY({ postData: data });
          if (response?.data?.success) {
            showSnackbar("City Added Successfully!");
            setManageAddState(false);
            getAllOperators({});
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

          let response = await EDIT_CITY({ postData: data });
          if (response?.data?.success) {
            showSnackbar("City Updated Successfully!");
            setManageAddState(false);
            getAllOperators({});
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      }
    },
  });

  useEffect(() => {
    GetAllCountries();
  }, []);
  // useEffect(() => {
  //   GetAllStates();
  //   GetAllDistrict();
  // }, [countryISO]);

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        {type == "add" && (
          <>
            <Grid item xs={12} sx={{ marginBottom: "10px" }}>
              <FormControl
                fullWidth
                variant="standard"
                error={formik.touched.country && Boolean(formik.errors.country)}
              >
                <InputLabel id="country-label">Country *</InputLabel>
                <Select
                  key="country"
                  id="country"
                  name="country"
                  label="Country"
                  labelId="country-label"
                  onChange={(e) => {
                    setRandomValue(Math.random());
                    formik.setFieldValue("country", e.target.value);
                    setCountryISO(
                      getIsoCodeByRecordGuid(e.target.value, countries)
                    );
                  }}
                  value={formik.values.country}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem
                      key={country.recordGuid}
                      value={country.recordGuid}
                    >
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.country && formik.errors.country && (
                  <FormHelperText>{formik.errors.country}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sx={{ marginTop: "10px" }}>
              <CustomAsyncPaginate
                key={randomValue}
                apiFunction={GET_ALL_STATE}
                value={formik.values.recordGuid}
                onChange={(value) => {
                  formik.setFieldValue("parentGuid", value.value);
                }}
                placeholder="State *"
                pageSize={10}
                dataPath="data.data.locations"
                totalRowsPath="data.data.totalRows"
                method="GET"
                id={`async-menu-style`}
                params={{ CountryIso: countryISO }}
                isDisabled={!formik.values.country}
              />
              {formik.touched.state && formik.errors.state && (
                <FormHelperText>{formik.errors.state}</FormHelperText>
              )}
              {formik.touched.state && formik.errors.state && (
                <FormHelperText>{formik.errors.state}</FormHelperText>
              )}
            </Grid> */}
            {/* <Grid item xs={12} sx={{ marginTop: "15px" }}> */}
            {/* <FormControl
                fullWidth
                variant="standard"
                error={
                  formik.touched.district && Boolean(formik.errors.district)
                }
              >
                <InputLabel id="district-label">District *</InputLabel>
                <Select
                  key="district"
                  id="district"
                  name="district"
                  label="District*"
                  labelId="district-label"
                  onChange={(e) => {
                    formik.setFieldValue("parentGuid", e.target.value);
                  }}
                  value={formik.values.recordGuid}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {district.map((district) => (
                    <MenuItem
                      key={district.recordGuid}
                      value={district.recordGuid}
                    >
                      {district.name}
                    </MenuItem>
                  ))}
                </Select> */}
            {/* <CustomAsyncPaginate
                key={randomValue}
                apiFunction={GET_ALL_DISTRICT}
                value={formik.values.recordGuid}
                onChange={(value) => {
                  formik.setFieldValue("parentGuid", value.value);
                }}
                placeholder="District *"
                pageSize={10}
                dataPath="data.data.locations"
                totalRowsPath="data.data.totalRows"
                method="GET"
                id={`async-menu-style`}
                params={{ CountryIso: countryISO }}
                isDisabled={!formik.values.country}
              />
              {formik.touched.district && formik.errors.district && (
                <FormHelperText>{formik.errors.district}</FormHelperText>
              )}
              {/* </FormControl> */}
            {/* </Grid>  */}
          </>
        )}
        <Grid item xs={12}>
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
