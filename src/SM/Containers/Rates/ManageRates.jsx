import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GET_ALL_COUNTRIES_API } from "../../../APIs/Criteria";
import { ADD_RATE, EDIT_RATE } from "../../../APIs/Rates";
import { GET_OPERATORS } from "../../../APIs/SMSAPIS";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { getCurrenciesData, handleMessageError } from "../../Utils/Functions";
import addValidationSchema from "./addValidation";
import editValidationSchema from "./editValidation";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import { GET_ALL_OPERATION } from "../../../APIs/ProfitLoss";
import addValidationWhatsappSchema from "./addValidationWhatsappSchema";
import { AsyncPaginate } from "react-select-async-paginate";
import { GET_ALL_CLIENTS_CATEGORY } from "../../../APIs/Clients";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { useLocation } from "react-router-dom";

function ManageRates({
  type,
  loading,
  setLoading,
  clientCategoryOptions,
  setManageAddRate,
  serviceGuid,
  channelGuid,
  getAllRates,
  selectedRate,
}) {
  const theme = useTheme();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [randomValue, setRandomValue] = useState("");
  const [countries, SetCountries] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [service, setService] = useState("");
  const [serviceTag, setServiceTag] = useState("");
  const [operationTypeOptions, setOperationTypeOptions] = useState([]);

  useEffect(() => {
    const pathService = location?.pathname?.split("/")[2];
    setService(pathService);
    const tag = HandleServiceTag(pathService);
    setServiceTag(tag);
  }, [location]);

  useEffect(() => {
    if (serviceTag == "WHATSAPP") {
      getAllOperation();
    }
  }, [serviceTag]);

  const getAllOperation = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_OPERATION();
      const options = response?.data?.data?.criteria?.map((item) => ({
        value: item?.tag,
        label: item?.name,
      }));
      setOperationTypeOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: formik?.values?.country?.value,
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

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("rate", value);
    }
  };

  const formik = useFormik({
    initialValues: {
      clientCategory: null,
      country: "",
      currency: "",
      operator: "",
      operationType: "",
      rate: type == "add" ? "" : selectedRate?.rate,
    },
    validationSchema:
      type == "add"
        ? serviceTag == "WHATSAPP"
          ? addValidationWhatsappSchema
          : addValidationSchema
        : editValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {};
          if (serviceTag != "WHATSAPP") {
            data = {
              ServiceGuid: serviceGuid,
              ChannelGuid: channelGuid,
              OperatorGuid: values?.operator?.value,
              CountryGuid: values?.country.value,
              CurrencyCode: values?.currency,
              OperationTypeTag: "GENERAL",
              ClientCategoryGuid: values?.clientCategory?.value,
              IsDefault: true,
              Rate: values?.rate,
            };
          } else {
            data = {
              ServiceGuid: serviceGuid,
              ChannelGuid: channelGuid,
              CountryGuid: values?.country.value,
              CurrencyCode: values?.currency,
              OperationTypeTag: values?.operationType,
              ClientCategoryGuid: values?.clientCategory?.value,
              IsDefault: true,
              Rate: values?.rate,
            };
          }

          let response = await ADD_RATE({ postData: data });
          if (response?.data?.success) {
            showSnackbar(response?.data?.message ?? "");
            setManageAddRate(false);
            getAllRates();
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
            Rate: values?.rate,
            RatePlanGuid: selectedRate?.recordGuid,
          };

          let response = await EDIT_RATE({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Rate Updated Successfully!");
            setManageAddRate(false);
            getAllRates();
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      }
    },
  });

  const loadClientCategoryOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_CLIENTS_CATEGORY({
        pageNumber: page,
        pageSize: 5,
        search,
      });
      const options = response?.data?.data?.clientCategory?.map((item) => ({
        value: item?.recordGuid,
        label: item?.clientCategoryDetails[0]?.name,
      }));

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 5 + response?.data?.data?.clientCategory?.length <
        response?.data?.data?.totalRows;

      return {
        options: options,
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

  useEffect(() => {
    getCurrenciesData(token)
      .then((currency) => {
        setCurrencyOptions(currency);
      })
      .catch((error) => {
        console.error("Error fetching currency data: ", error);
      });
  }, []);

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        {type == "add" && (
          <>
            <Grid item xs={12}>
              {formik?.values?.clientCategory != "" &&
              formik?.values?.clientCategory != undefined ? (
                <InputLabel sx={{ fontSize: "12px", marginBottom: "-5px" }}>
                  Client Category
                </InputLabel>
              ) : (
                <InputLabel sx={{ marginTop: "10px" }} />
              )}
              <AsyncPaginate
                id="async-menu-style"
                value={formik?.values?.clientCategory}
                loadOptions={loadClientCategoryOptions}
                additional={{
                  page: 1,
                }}
                onChange={(value) => {
                  formik?.setFieldValue("clientCategory", value);
                }}
                placeholder="Client Category"
                classNamePrefix="react-select"
              />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: "20px" }}>
              <CustomAsyncPaginate
                apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                value={formik?.values?.country}
                onChange={(value) => {
                  formik.setFieldValue("country", value);
                  formik.setFieldValue("operator", "");
                  setRandomValue(Math.random());
                }}
                placeholder="Country *"
                pageSize={10}
                dataPath="data.data.countries" // Adjust path based on API response structure
                totalRowsPath="data.data.totalRows"
                method="GET"
                id={`async-menu-style`}
              />
              {formik.touched.country && formik.errors.country && (
                <FormHelperText>{formik.errors.country}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} key={randomValue} sx={{ marginTop: "20px" }}>
              <FormControl
                fullWidth
                variant="standard"
                sx={{ m: 0, minWidth: 250 }}
                id="currency"
                name="currency"
                error={
                  formik.touched["currency"] &&
                  Boolean(formik.errors["currency"])
                }
                helperText={
                  formik.touched["currency"] && formik.errors["currency"]
                }
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Currency *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="currency"
                  name="currency"
                  onChange={(e) => {
                    formik.setFieldValue("currency", e.target.value);
                  }}
                  value={formik.values.currency}
                  label="Select Payment Type"
                  error={
                    formik.touched["currency"] &&
                    Boolean(formik.errors["currency"])
                  }
                  helperText={
                    formik.touched["currency"] && formik.errors["currency"]
                  }
                >
                  {currencyOptions.map((option, index) => (
                    <MenuItem key={index} value={option?.code}>
                      {option?.tag}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.currency && formik.errors.currency && (
                  <FormHelperText>{formik.errors.currency}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "10px" }}>
              {serviceTag != "WHATSAPP" ? (
                <>
                  {formik.touched.country != "" &&
                  formik.touched.country != undefined ? (
                    <InputLabel
                      error={
                        formik?.touched["operator"] &&
                        Boolean(formik?.errors["operator"])
                      }
                      helperText={
                        formik?.touched["operator"] &&
                        formik?.errors["operator"]
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
                  />
                  {formik?.touched?.operator && formik?.errors?.operator && (
                    <FormHelperText style={{ color: "#d32f2f" }}>
                      {formik?.errors?.operator}
                    </FormHelperText>
                  )}
                  <FormHelperText style={{ color: "#d32f2f" }}>
                    *rate will be added to all operators if not any is selected
                  </FormHelperText>
                </>
              ) : (
                <>
                  <FormControl fullWidth variant="standard">
                    <InputLabel
                      id="operationType-label"
                      error={
                        formik.touched["operationType"] &&
                        Boolean(formik.errors["operationType"])
                      }
                    >
                      Operation Type*
                    </InputLabel>
                    <Select
                      key="operationType"
                      id="operationType"
                      name="operationType"
                      label="Operation Type"
                      labelId="operationType-label"
                      value={formik.values.operationType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.operationType &&
                        Boolean(formik.errors.operationType)
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {operationTypeOptions?.map((item) => (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.operationType &&
                      formik.errors.operationType && (
                        <FormHelperText
                          style={{ color: theme?.palette?.error?.main }}
                        >
                          {formik.errors.operationType}
                        </FormHelperText>
                      )}
                  </FormControl>
                </>
              )}
            </Grid>
          </>
        )}
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"rate"}
              fullWidth
              id={"rate"}
              name={"rate"}
              label={"Rate *"}
              variant="standard"
              type="text"
              value={formik?.values?.rate}
              onChange={handleNumberChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rate && Boolean(formik.errors.rate)}
              helperText={formik.touched.rate && formik.errors.rate}
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
            id="add-rate"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageRates);
