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
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { AsyncPaginate } from "react-select-async-paginate";
import { getCurrenciesData, handleMessageError } from "../../Utils/Functions";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { useSelector } from "react-redux";
import {
  ADD_COST,
  EDIT_COST,
  GET_ALL_PROVIDERS_CATEGORY,
} from "../../../APIs/Costs";
import { GET_PROVIDERS_BY_SERVICE } from "../../../APIs/Clients";
import { useFormik } from "formik";
import { GET_OPERATORS } from "../../../APIs/SMSAPIS";
import { GET_ALL_COUNTRIES_API } from "../../../APIs/Criteria";
import addValidationSchema from "./addValidation";
import editValidationSchema from "./editValidation";
import { GET_ALL_OPERATION } from "../../../APIs/ProfitLoss";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import addValidationWhatsappSchema from "./addValidationWhatsappSchema";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { useLocation } from "react-router-dom";

function ManageCost({
  type,
  loading,
  setLoading,
  providerCategoryOptions,
  setManageAddCost,
  serviceGuid,
  channelGuid,
  getAllCosts,
  selectedCost,
}) {
  const theme = useTheme();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [randomValue, setRandomValue] = useState("");
  const [countries, SetCountries] = useState([]);
  const [operatorOption, setOperatorOption] = useState([]);
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
        ProviderCategoryGuid: recordGuid
          ? recordGuid
          : formik?.values?.providerCategory?.value,
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
      formik.setFieldValue("cost", value);
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

  const formik = useFormik({
    initialValues: {
      providerCategory: "",
      provider: "",
      country: "",
      currency: "",
      operator: "",
      operationType: "",
      cost: type == "add" ? "" : selectedCost?.cost,
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
              ProviderCategoryGuid: values?.providerCategory,
              ProviderGuid: values?.provider?.value,
              IsDefault: true,
              Cost: values?.cost,
            };
          } else {
            data = {
              ServiceGuid: serviceGuid,
              ChannelGuid: channelGuid,
              CountryGuid: values?.country.value,
              CurrencyCode: values?.currency,
              OperationTypeTag: values?.operationType,
              ProviderCategoryGuid: values?.providerCategory,
              ProviderGuid: values?.provider?.value,
              IsDefault: true,
              Cost: values?.cost,
            };
          }
          let response = await ADD_COST({ postData: data });
          if (response?.data?.success) {
            showSnackbar(response?.data?.message);
            setManageAddCost(false);
            getAllCosts();
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
            Cost: values?.cost,
            CostPlanGuid: selectedCost?.recordGuid,
          };

          let response = await EDIT_COST({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Cost Updated Successfully!");
            setManageAddCost(false);
            getAllCosts();
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      }
    },
  });
  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_PROVIDERS_CATEGORY({
        pageNumber: page,
        pageSize: 5,
        search: search,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 5 + response?.data?.data?.providerCategories?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.providerCategories?.map((item) => ({
          value: item?.recordGuid,
          label: item?.providerCategoryDetails[0]?.name,
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
  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        {type == "add" && (
          <>
            <Grid item xs={12}>
              <CustomAsyncPaginate
                apiFunction={GET_ALL_PROVIDERS_CATEGORY} // Pass the function directly
                value={formik?.values?.providerCategory}
                onChange={(value) => {
                  formik.setFieldValue("providerCategory", value);
                  setRandomValue(Math.random());
                }}
                placeholder="Provider Category *"
                pageSize={10}
                dataPath="data.data.providerCategories" // Adjust path based on API response structure
                totalRowsPath="data.data.totalRows"
                method="GET"
                id={`async-menu-style-accounts`}
                isNested
                labelPath={"providerCategoryDetails"}
              />
              {formik?.touched?.providerCategory &&
                formik?.errors?.providerCategory && (
                  <FormHelperText style={{ color: "#d32f2f" }}>
                    {formik?.errors?.providerCategory}
                  </FormHelperText>
                )}
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "5px" }}>
              {/* {formik?.values?.providerCategory != "" &&
              formik?.values?.providerCategory != undefined ? (
                <InputLabel
                  error={
                    formik?.touched["provider"] &&
                    Boolean(formik?.errors["provider"])
                  }
                  helperText={
                    formik?.touched["provider"] && formik?.errors["provider"]
                  }
                  sx={{ fontSize: "12px", marginBottom: "-5px" }}
                >
                  Provider
                </InputLabel>
              ) : (
                <InputLabel sx={{ marginTop: "10px" }} />
              )}
              <AsyncPaginate
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
                isDisabled={
                  formik?.values?.providerCategory == "" ||
                  formik?.values?.providerCategory == undefined
                }
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
                isDisabled={
                  formik?.values?.providerCategory == "" ||
                  formik?.values?.providerCategory == undefined
                }
                placeholder="Provider"
                pageSize={10}
                dataPath="data.data.items" // Adjust path based on API response structure
                totalRowsPath="data.data.totalRows"
                method="GET"
                id={`async-menu-style-accounts`}
                params={{
                  token,

                  typeTag: "",
                  RecordGuid: serviceGuid ? serviceGuid : "undefined",
                  ProviderCategoryGuid: formik?.values?.providerCategory?.value,
                }}
              />
              {formik?.touched?.provider && formik?.errors?.provider && (
                <FormHelperText style={{ color: "#d32f2f" }}>
                  {formik?.errors?.provider}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "5px" }}>
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
                id={`async-menu-style-accounts`}
              />
              {formik.touched.country && formik.errors.country && (
                <FormHelperText style={{ color: "#d32f2f" }}>
                  {formik.errors.country}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} key={randomValue} sx={{ marginTop: "5px" }}>
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
            <Grid item xs={12} sx={{ marginTop: "5px" }}>
              {serviceTag != "WHATSAPP" ? (
                <>
                  {/* {formik?.values?.operator != "" &&
                  formik?.values?.operator != undefined ? (
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
                  /> */}
                  <CustomAsyncPaginate
                    key={randomValue}
                    apiFunction={GET_OPERATORS} // Pass the function directly
                    value={formik?.values?.operator}
                    onChange={(value) => {
                      formik.setFieldValue("operator", value);
                    }}
                    isDisabled={
                      formik?.values?.country == "" ||
                      formik?.values?.country == undefined
                    }
                    placeholder="Operator"
                    pageSize={10}
                    dataPath="data.data.items" // Adjust path based on API response structure
                    totalRowsPath="data.data.totalRows"
                    method="GET"
                    id={`async-menu-style-accounts`}
                    params={{ iso: formik?.values?.country?.value }}
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
        <Grid item xs={12} sx={{ marginTop: "5px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"cost"}
              fullWidth
              id={"cost"}
              name={"cost"}
              label={"Cost *"}
              variant="standard"
              type="text"
              value={formik?.values?.cost}
              onChange={handleNumberChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cost && Boolean(formik.errors.cost)}
              helperText={formik.touched.cost && formik.errors.cost}
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

export default withTranslation("translations")(ManageCost);
