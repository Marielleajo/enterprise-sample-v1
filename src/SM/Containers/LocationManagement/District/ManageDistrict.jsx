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
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  ADD_DISTRICT,
  EDIT_DISTRICT,
  EDIT_OPERATOR,
  GET_ALL_STATE,
} from "../../../../APIs/Configuration";
import {
  GET_ACTIVE_COUNTRIES_API,
  GET_ALL_COUNTRIES_API,
} from "../../../../APIs/Criteria";
import { handleMessageError } from "../../../Utils/Functions";
import Notification from "../../../../Components/Notification/Notification";
import addValidationSchema from "../../Configuration/Prefixes/addValidation";
import editValidationSchema from "../../Configuration/Prefixes/editValidation";
import { useSelector } from "react-redux";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { getIsoCodeByRecordGuid } from "../helper";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  addDistrictValidationSchema,
  editDistrictValidationSchema,
} from "./DistrictValidation";

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
  const { token } = useSelector((state) => state.authentication);
  const [countryISO, setCountryISO] = useState("");
  // Get all countries
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ACTIVE_COUNTRIES_API({
        pageSize: 1000,
      });
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };
  const GetAllStates = async () => {
    try {
      let stateResp = await GET_ALL_STATE({
        token,
        pageSize: 100,
        CountryIso: countryISO,
      });
      SetStates(stateResp?.data?.data?.locations);
    } catch (e) {
      Notification.error(e);
    }
  };
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
  const loadCountryOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ACTIVE_COUNTRIES_API({
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.countries?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.countries?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
          countryISO: item.isoCode,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };
  const formik = useFormik({
    initialValues: {
      Name: type == "add" ? "" : selectedOperator?.name,
      country: "",
      // parentGuid: "",
      description:
        type === "add"
          ? ""
          : getDescriptionByLanguages(selectedOperator?.details, "en", "fr"),
      isActive: type == "add" ? true : selectedOperator?.isActive,
    },
    validationSchema:
      type == "add"
        ? addDistrictValidationSchema
        : editDistrictValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            Name: values?.Name || "",
            CountryGuid: values?.country.value || "",
            IsActive: values?.switchState,
            // ParentGuid: values?.parentGuid,
            Details: [
              {
                name: values?.Name || "",
                Description: values?.description || "",
                LanguageCode: values?.languageCode || "en",
              },
            ],
          };

          let response = await ADD_DISTRICT({ postData: data });
          if (response?.data?.success) {
            showSnackbar("District Added Successfully!");
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

          let response = await EDIT_DISTRICT({ postData: data });
          if (response?.data?.success) {
            showSnackbar("District Updated Successfully!");
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

  // useEffect(() => {
  //   GetAllCountries();
  // }, []);

  // useEffect(() => {
  //   if (formik.values.country) {
  //     GetAllStates();
  //   }
  // }, [countryISO]);

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        {type == "add" && (
          <>
            <Grid item xs={12} sx={{ marginTop: "0px", marginBottom: "10px" }}>
              <AsyncPaginate
                id="async-menu-style"
                value={formik.values.country}
                loadOptions={loadCountryOptions}
                additional={{
                  page: 1,
                }}
                onChange={(value) => {
                  formik.setFieldValue("country", value);
                  setCountryISO(value?.countryISO);
                }}
                placeholder="Country"
                classNamePrefix="react-select"
              />
              {formik.touched.country && formik.errors.country && (
                <FormHelperText sx={{ color: "red" }}>
                  {formik.errors.country}
                </FormHelperText>
              )}
            </Grid>
            {/* <Grid item xs={12} sx={{ marginTop: "10px" }}>
              <CustomAsyncPaginate
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
              {formik.touched.parentGuid && formik.errors.parentGuid && (
                <FormHelperText sx={{ color: "red" }}>
                  {formik.errors.parentGuid}
                </FormHelperText>
              )}
            </Grid> */}
          </>
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
