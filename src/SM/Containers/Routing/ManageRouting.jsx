import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import { GET_PROVIDERS_BY_SERVICE } from "../../../APIs/Clients";
import { GET_ALL_COUNTRIES_API } from "../../../APIs/Criteria";
import { ADD_ROUTE, EDIT_ROUTE } from "../../../APIs/Routing";
import { GET_OPERATORS } from "../../../APIs/SMSAPIS";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import addValidationSchema from "./addValidation";
import editValidationSchema from "./editValidation";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

function ManageRouting({
  type,
  loading,
  setLoading,
  clientCategoryOptions,
  setManageAddRoute,
  serviceGuid,
  getAllRoutes,
  selectedRoute,
  serviceURL,
}) {
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [randomValue, setRandomValue] = useState("");
  const [countries, SetCountries] = useState([]);

  // Get all countries
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const loadProviderOptions = async (
    search,
    loadedOptions,
    { page, recordGuid }
  ) => {
    try {
      let response = await GET_PROVIDERS_BY_SERVICE({
        token,
        pageNumber: page,
        pageSize: 10,
        search: search,
        typeTag: "",
        RecordGuid: serviceGuid ? serviceGuid : "undefined",
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.items?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
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

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: formik?.values?.country,
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.items?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
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
      clientCategory: "",
      country: "",
      operator: "",
      provider:
        type === "add"
          ? ""
          : {
              value: selectedRoute?.providerGuid,
              label: selectedRoute?.providerName,
            },
    },
    validationSchema:
      type == "add" ? addValidationSchema : editValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            OperatorGuid: values?.operator?.value,
            CountryGuid: values?.country,
            ClientCategoryGuid: values?.clientCategory,
            ProviderGuid: values?.provider?.value,
          };

          let response = await ADD_ROUTE({ postData: data, serviceURL });
          if (response?.data?.success) {
            showSnackbar("Route Added Successfully!");
            setManageAddRoute(false);
            getAllRoutes();
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
            providerGuid: values?.provider?.value,
            recordGuid: selectedRoute?.recordGuid,
          };

          let response = await EDIT_ROUTE({ postData: data, serviceURL });
          if (response?.data?.success) {
            showSnackbar("Route Updated Successfully!");
            setManageAddRoute(false);
            getAllRoutes();
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

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        {type == "add" && (
          <>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="standard"
                error={
                  formik?.touched["clientCategory"] &&
                  Boolean(formik?.errors["clientCategory"])
                }
                helperText={
                  formik?.touched["clientCategory"] &&
                  formik?.errors["clientCategory"]
                }
              >
                <InputLabel id="clientCategory-label">
                  Client Category *
                </InputLabel>
                <Select
                  key="clientCategory"
                  id="clientCategory"
                  name="clientCategory"
                  label="clientCategory"
                  labelId="clientCategory-label"
                  onChange={(e) => {
                    formik?.setFieldValue("clientCategory", e.target.value);
                    setRandomValue(Math.random());
                  }}
                  error={
                    formik?.touched["clientCategory"] &&
                    Boolean(formik?.errors["clientCategory"])
                  }
                  helperText={
                    formik?.touched["clientCategory"] &&
                    formik?.errors["clientCategory"]
                  }
                  value={formik?.values?.clientCategory || ""}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {clientCategoryOptions?.map((item) => (
                    <MenuItem key={item?.value} value={item?.value}>
                      {item?.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik?.touched?.clientCategory &&
                  formik?.errors?.clientCategory && (
                    <FormHelperText style={{ color: "#d32f2f" }}>
                      {formik?.errors?.clientCategory}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: "20px" }}>
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
                    formik.setFieldValue("country", e.target.value);
                    formik.setFieldValue("operator", "");
                    setRandomValue(Math.random());
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

            <Grid item xs={12} sx={{ marginTop: "20px" }}>
              {/* {formik.touched.country != "" &&
              formik.touched.country != undefined ? (
                <InputLabel
                  error={
                    formik?.touched["operator"] &&
                    Boolean(formik?.errors["operator"])
                  }
                  helperText={
                    formik?.touched["operator"] && formik?.errors["operator"]
                  }
                  sx={{ fontSize: "12px", marginBottom: "-5px" }}
                >
                  Operator
                </InputLabel>
              ) : (
                <InputLabel sx={{ marginTop: "10px" }} />
              )}
              <AsyncPaginate
                key={randomValue}
                id="async-menu-style"
                onChange={(value) => {
                  formik.setFieldValue("operator", value);
                }}
                value={formik?.values?.operator}
                loadOptions={loadOperatorOptions}
                additional={{
                  page: 1,
                }}
                isDisabled={
                  formik?.values?.country == "" ||
                  formik?.values?.country == undefined
                }
                placeholder="Operator"
                classNamePrefix="react-select"
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    maxHeight: 150, // Adjust height as needed
                    overflow: "hidden", // Hide scrollbar
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: 150, // Adjust height as needed
                    overflowY: "auto", // Enable vertical scroll if needed
                  }),
                }}
              /> */}
              <CustomAsyncPaginate
                key={randomValue}
                apiFunction={GET_OPERATORS} // Pass the function directly
                onChange={(value) => {
                  formik.setFieldValue("operator", value);
                }}
                value={formik?.values?.operator}
                placeholder="Operator"
                pageSize={10}
                dataPath="data.data.items" // Adjust path based on API response structure
                totalRowsPath="data.data.totalRows"
                method="GET"
                isDisabled={
                  formik?.values?.country == "" ||
                  formik?.values?.country == undefined
                }
                id={`async-menu-style-accounts`}
                params={{ iso: formik?.values?.country }}
              />
              {formik?.touched?.operator && formik?.errors?.operator && (
                <FormHelperText style={{ color: "#d32f2f" }}>
                  {formik?.errors?.operator}
                </FormHelperText>
              )}
            </Grid>
          </>
        )}

        <Grid item xs={12} sx={{ marginTop: "20px" }}>
          {/* <AsyncPaginate
            key={randomValue}
            id="async-menu-style"
            value={formik?.values?.provider}
            loadOptions={loadProviderOptions}
            onChange={(value) => {
              formik?.setFieldValue("provider", value);
            }}
            additional={{
              page: 1,
            }}
            placeholder="Provider *"
            classNamePrefix="react-select"
          /> */}
          <CustomAsyncPaginate
            key={randomValue}
            apiFunction={GET_PROVIDERS_BY_SERVICE} // Pass the function directly
            value={formik?.values?.provider}
            onChange={(value) => {
              formik?.setFieldValue("provider", value);
            }}
            placeholder="Provider *"
            pageSize={10}
            dataPath="data.data.items" // Adjust path based on API response structure
            totalRowsPath="data.data.totalRows"
            method="GET"
            isDisabled={
              formik?.values?.country == "" ||
              formik?.values?.country == undefined
            }
            id={`async-menu-style-accounts`}
            params={{
              token,
              typeTag: "",
              RecordGuid: serviceGuid ? serviceGuid : "undefined",
            }}
          />
          {formik?.touched?.provider && formik?.errors?.provider && (
            <FormHelperText style={{ color: "#d32f2f" }}>
              {formik?.errors?.provider}
            </FormHelperText>
          )}
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
            id="add-Route"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageRouting);
