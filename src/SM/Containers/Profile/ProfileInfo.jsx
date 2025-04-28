import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GET_CLIENT, UPDATE_ADVANCED_CLIENT } from "../../../APIs/Clients";
import { GET_ADDRESS } from "../../../APIs/Common";
import {
  ADD_INDUSTRY,
  GET_ALL_CITIES_API,
  GET_ALL_COUNTRIES_API,
  GET_ALL_INDUSTRIES,
} from "../../../APIs/Criteria";
import { GET_ALL_USERS } from "../../../APIs/Users";
import AccordionComponent from "../../../Components/Accordion/AccordionComponent";
import Notification from "../../../Components/Notification/Notification";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import {
  HandleApiError,
  handleMessageError,
  removeNullKeys,
  updateState,
} from "../../Utils/Functions";
import validationSchema from "./editvalidation";

const filter = createFilterOptions();

const ProfileInfo = ({ t }) => {
  const { clientId } = useSelector((state) => state?.authentication);
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [GlobalData, SetGlobalData] = useState({
    steps: [
      {
        label: "Account Information",
      },
      // {
      //   label: "Account Config",
      // },
      // {
      //   label: "Account Type",
      // },
      {
        label: "Engagement",
      },
    ],
    activeStep: 0,
  });
  const { steps, activeStep } = GlobalData;

  const formik = useFormik({
    initialValues: {
      clientName: "",
      email: "",
      username: "",
      businesswebsite: "",
      phone: "",
      category: "",
      account_manager: "",
      country: "",
      street: "",
      city: "",
      region: "",
      state: "",
      zip: "",
      building: "",
      floor: "",
      room: "",
      address1: "",
      address2: "",
      Info: {
        IndustryTag: null,
        // "IndustryTag": "54c8ddb8-6bc1-4c95-a24a-f2cc2ec2b6f1"
      },
      accountType: null,

      alertemail: false,
      "Allow number lookup customization": false,
      "Allow viber customization": false,
      "Allow sms rate customization": false,
      "Allow sign up": false,
      "Alerts via email": "",

      BillingEmail: "",
      TechnicalEmail: "",
      AlertsEmail: "",
      logoUrl: null,
      BusinessWebUrl: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema[activeStep],
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        let data = {
          RecordGuid: clientId,
          //   TitleTag: "",
          //   TypeTag: "BUSINESS",
          //   Username: values["username"],
          //   Password: "P@ssw0rd",
          Name: values["clientName"],
          // CategoryId: values["category"],
          //   logoUrl: values["logoUrl"],
          //   PolicyId: import.meta.env.REACT_APP_CLIENT_ID,
          CountryGuid: values["country"],
          CompanyWebsite: values["businesswebsite"],
          //   Email: values["email"],
          FirstName: values["clientName"],
          Address: {
            Street: values["street"] || null,
            CityGuid: values["city"] || null,
            Region: values["region"] || null,
            State: values["state"] || null,
            Zip: values["zip"] || null,
            Building: values["building"] || null,
            Floor: values["floor"] || null,
            RoomNumber: values["room"] || null,
            Address1: values["address1"] || null,
            Address2: values["address2"] || null,
          },

          //   Config: [
          //     ...config?.map((item) => {
          //       return {
          //         ...item,
          //         Parameter: [
          //           {
          //             Name: item?.ParameterName,
          //             LanguageCode: "en",
          //           },
          //         ],
          //         ParameterValue:
          //           `${formik?.values[item?.ParameterName]}` ||
          //           (item?.ParameterType == "BOOL" ? "false" : ""),
          //       };
          //     }),
          //   ],
          Info: {
            // IndustryTag: values?.Info?.IndustryTag,
            BillingEmail: values?.BillingEmail || null,
            TechnicalEmail: values?.TechnicalEmail || null,
            AlertsEmail: values?.AlertsEmail || null,
            BusinessWebUrl: values?.BusinessWebUrl || null,
            // AccountManagerGuid: values?.account_manager,
          },
        };

        let formData = removeNullKeys(data);

        if (Object.keys(formData?.Address).length == 0)
          delete formData["Address"];
        if (Object.keys(formData?.Info).length == 0) delete formData["Info"];

        try {
          let recordResponse = await UPDATE_ADVANCED_CLIENT(formData);
          if (recordResponse?.data?.success) {
            showSnackbar("Profile updated successfully", "success");
            // Notification?.success("Reseller added successfully");
            SetGlobalData(updateState(GlobalData, "path", "main"));
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        }
      } else
        SetGlobalData(updateState(GlobalData, "activeStep", activeStep + 1));
    },
  });

  const fetchClientById = useCallback(async ({ client }) => {
    setLoading(true);
    try {
      let clientResponse = await GET_CLIENT({ client });
      let _client = clientResponse?.data?.data?.client;
      formik.setFieldValue("clientName", _client?.firstName);
      formik.setFieldValue("email", _client?.email);
      formik.setFieldValue("businesswebsite", _client?.companyWebsite);
      formik.setFieldValue("phone", _client?.mobileNumber);
      formik.setFieldValue("country", _client?.countryRecordGuid);
      formik.setFieldValue("username", _client?.username);

      formik.setFieldValue(
        "BusinessWebUrl",
        _client?.clientInfo?.businessWebUrl
      );
      formik.setFieldValue("AlertsEmail", _client?.clientInfo?.alertsEmail);
      formik.setFieldValue(
        "TechnicalEmail",
        _client?.clientInfo?.technicalEmail
      );
      formik.setFieldValue("BillingEmail", _client?.clientInfo?.billingEmail);

      if (_client?.countryRecordGuid) {
        getCities({ country: _client?.countryRecordGuid });
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      fetchClientById({ client: clientId });
    }
  }, [clientId]);

  const [Countries, SetCountries] = useState([]);
  const [Industries, SetIndustries] = useState([]);
  const [Cities, SetCities] = useState([]);
  const [AccountManagers, SetAccountManagers] = useState([]);
  const [field1Value, setField1Value] = useState("");
  const [field2Value, setField2Value] = useState("");

  const handleBack = () => {
    if (activeStep == 0) {
    } else SetGlobalData(updateState(GlobalData, "activeStep", activeStep - 1));
  };

  const handleField1Change = (event) => {
    const newValue = event.target.value;

    if (formik.values.accountType === "Revenue Share") {
      // Calculate the second field's value when type is Revenue Shared
      const percentage = parseFloat(newValue);
      if (!isNaN(percentage)) {
        const secondFieldValue = 100 - percentage;
        setField2Value(secondFieldValue.toFixed(2)); // Round to 2 decimal places
      } else {
        setField2Value("");
      }
    }
    setField1Value(newValue);
  };

  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const GetAllIndustries = async () => {
    try {
      let industriesResponse = await GET_ALL_INDUSTRIES();
      SetIndustries(
        industriesResponse?.data?.data?.industries?.map((item) => {
          return { name: item?.details[0].name, id: item?.recordGuid };
        })
      );
    } catch (e) {
      Notification.error(e);
    }
  };

  const handleIndustryChange = async (event, newValue) => {
    // Check if the selected value is a free-solo value
    const isFreeSolo = !Industries.some((option) => option.id === newValue?.id);
    let recordGuid = "";

    if (isFreeSolo) {
      try {
        let industryAdd = await ADD_INDUSTRY({
          token,
          formData: {
            details: [
              {
                name: newValue?.name,
                description: newValue?.name,
                languageCode: "en",
              },
            ],
          },
        });
        recordGuid = industryAdd?.data?.data?.recordGuid;
      } catch (e) {
        HandleApiError(e);
      }
      await GetAllIndustries();
    } else {
      recordGuid = newValue?.id;
    }

    // Update Formik values
    formik.setValues({
      ...formik.values,
      Info: {
        IndustryTag: recordGuid,
      },
    });
  };

  const getCities = async ({ country }) => {
    try {
      let citiesResponse = await GET_ALL_CITIES_API({ country });
      SetCities(citiesResponse?.data?.data?.cities);
    } catch (e) {
      HandleApiError(e);
    }
  };
  const getAllAccountManager = async () => {
    try {
      const userResponse = await GET_ALL_USERS({
        token,
        pageSize: 10000,
        pageNumber: -1,
        type: "ACCOUNT_MANAGER",
      });

      SetAccountManagers(userResponse?.data?.data?.users);
    } catch (e) {
      HandleApiError(e);
    }
  };

  const getAddress = async () => {
    try {
      let response = await GET_ADDRESS({ clientGuid: clientId });
      let address = response?.data?.data?.address;
      formik.setValues({
        ...formik.values,
        address1: address?.address1,
        address2: address?.address2,
        building: address?.building,
        floor: address?.floor,
        region: address?.region,
        state: address?.state,
        street: address?.street,
        zip: address?.zip,
        room: address?.roomNumber,
        city: address?.cityRecordGuid,
      });
      // formik.setFieldValue("address1",address?.address1);
      // formik.setFieldValue("address2",address?.address2);
      // formik.setFieldValue("building",address?.building);
      // formik.setFieldValue("floor",address?.floor);
      // formik.setFieldValue("region",address?.region);
      // formik.setFieldValue("state",address?.state);
      // formik.setFieldValue("street",address?.street);
      // formik.setFieldValue("zip",address?.zip);
      // formik.setFieldValue("room",address?.roomNumber);
    } catch (e) {
      console.log(e);
      // showSnackbar(handleMessageError({ e }), "error");
    }
  };

  useEffect(() => {
    GetAllCountries();
    GetAllIndustries();
    getAllAccountManager();
    getAddress();
  }, []);

  // useEffect(() => {
  //   console.log(formik?.values);
  // }, [formik?.values]);

  return (
    <Grid container id="Client">
      {loading ? (
        <Grid container>
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            Loading...
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={12} md={2}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              className="pt-4"
            >
              {steps.map((step, index) => {
                return (
                  <Step key={step.label}>
                    <StepLabel
                      optional={
                        index === steps.length - 1 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>

          <Grid item xs={12} md={10}>
            <Box className="pt-4">
              <Typography variant="h5"> {steps[activeStep].label}</Typography>
            </Box>
            <form onSubmit={formik?.handleSubmit}>
              {activeStep === 0 && (
                <Box>
                  <Grid container columnGap={2} rowGap={0.5}>
                    <Grid container direction={"row"} columnGap={2}>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"clientName"}
                            fullWidth
                            id={"clientName"}
                            name={"clientName"}
                            label={"Client Name"}
                            variant="standard"
                            type={"text"}
                            value={formik.values["clientName"]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["clientName"] &&
                              Boolean(formik.errors["clientName"])
                            }
                            helperText={
                              formik.touched["clientName"] &&
                              formik.errors["clientName"]
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container direction={"row"} columnGap={2}>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"email"}
                            fullWidth
                            id={"email"}
                            name={"email"}
                            label={"Email Sender"}
                            disabled
                            variant="standard"
                            type={"email"}
                            value={formik.values["email"]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["email"] &&
                              Boolean(formik.errors["email"])
                            }
                            helperText={
                              formik.touched["email"] && formik.errors["email"]
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"username"}
                            fullWidth
                            id={"username"}
                            name={"username"}
                            label={"Username"}
                            variant="standard"
                            type={"text"}
                            disabled
                            value={formik.values["username"]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["username"] &&
                              Boolean(formik.errors["username"])
                            }
                            helperText={
                              formik.touched["username"] &&
                              formik.errors["username"]
                            }
                          />
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={5}>
                        <Autocomplete
                          id="tags-filled"
                          options={Industries}
                          freeSolo
                          value={Industries?.find(
                            (item) =>
                              item?.id == formik?.values?.Info?.IndustryTag
                          )}
                          getOptionLabel={(option) => option.name}
                          renderOption={(props, option) => (
                            <li {...props}>{option.name}</li>
                          )}
                          onChange={handleIndustryChange}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option?.name}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some(
                              (option) => inputValue === option.name
                            );
                            if (inputValue !== "" && !isExisting) {
                              filtered.push({
                                name: inputValue,
                              });
                            }
                            return filtered;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Industries"
                              placeholder="Industries"
                              error={
                                formik.touched.Info?.IndustryTag &&
                                Boolean(formik.errors.Info?.IndustryTag)
                              }
                              helperText={
                                formik.touched.Info?.IndustryTag &&
                                formik.errors.Info?.IndustryTag
                              }
                            />
                          )}
                        />
                      </Grid> */}
                    </Grid>
                    <Grid container direction={"row"} columnGap={2}>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"businesswebsite"}
                            fullWidth
                            id={"businesswebsite"}
                            name={"businesswebsite"}
                            label={"Business Website"}
                            variant="standard"
                            type={"text"}
                            value={formik.values["businesswebsite"]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["businesswebsite"] &&
                              Boolean(formik.errors["businesswebsite"])
                            }
                            helperText={
                              formik.touched["businesswebsite"] &&
                              formik.errors["businesswebsite"]
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"phone"}
                            fullWidth
                            id={"phone"}
                            name={"phone"}
                            label={"Mobile Number"}
                            disabled
                            variant="standard"
                            type={"text"}
                            value={formik.values["phone"]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["phone"] &&
                              Boolean(formik.errors["phone"])
                            }
                            helperText={
                              formik.touched["phone"] && formik.errors["phone"]
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container direction={"row"} columnGap={2}>
                      {/* <Grid item xs={5}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel id="category">Assign Category</InputLabel>
                          <Select
                            id="category" // Add an id for accessibility
                            name="category" // Name should match the field name in initialValues
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                            labelId="category"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="17d36b9e-37dc-4286-a42c-09640c9f2178">
                              Category 1
                            </MenuItem>
                            <MenuItem value="17d36b9e-37dc-4286-a42c-09640c9f2178">
                              Category 2
                            </MenuItem>
                          </Select>
                        </FormControl>
                        {formik.touched.category && formik.errors.category && (
                          <FormHelperText style={{ color: "red" }}>
                            {formik.errors.category}
                          </FormHelperText>
                        )}
                      </Grid> */}
                      {/* <Grid item xs={5}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel id="account">
                            Assign account manager
                          </InputLabel>
                          <Select
                            id="account" // Add an id for accessibility
                            name="account_manager" // Name should match the field name in initialValues
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.account_manager}
                            labelId="account"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {AccountManagers.length > 0 &&
                              AccountManagers?.map((manager) => (
                                <MenuItem
                                  value={manager?.recordGuid}
                                >{`${manager?.firstName} ${manager?.lastName}`}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {formik.touched.account_manager &&
                          formik.errors.account_manager && (
                            <FormHelperText style={{ color: "red" }}>
                              {formik.errors.account_manager}
                            </FormHelperText>
                          )}
                      </Grid> */}
                    </Grid>
                    <Grid
                      container
                      direction={"row"}
                      columnGap={2}
                      marginTop={2}
                    >
                      <Grid item xs={12}>
                        <AccordionComponent
                          title="Address Information"
                          style={{ width: "85%", boxShadow: "none" }}
                        >
                          <Grid
                            container
                            direction="row"
                            columnSpacing={2}
                            rowSpacing={0.5}
                          >
                            <Grid item xs={12}>
                              <FormControl fullWidth variant="standard">
                                <InputLabel id="country">Country</InputLabel>
                                <Select
                                  key="country"
                                  id="country" // Add an id for accessibility
                                  name="country" // Name should match the field name in initialValues
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                    getCities({ country: e?.target?.value });
                                  }}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.country}
                                  labelId="country"
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {Countries?.map((country) => (
                                    <MenuItem value={country?.recordGuid}>
                                      {country?.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              {formik.touched.country &&
                                formik.errors.country && (
                                  <FormHelperText style={{ color: "red" }}>
                                    {formik.errors.country}
                                  </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"region"}
                                  fullWidth
                                  id={"region"}
                                  name={"region"}
                                  label={"Region"}
                                  variant="standard"
                                  type={"text"}
                                  value={formik.values["region"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["region"] &&
                                    Boolean(formik.errors["region"])
                                  }
                                  helperText={
                                    formik.touched["region"] &&
                                    formik.errors["region"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl fullWidth variant="standard">
                                <InputLabel id="city">City</InputLabel>
                                <Select
                                  key="city"
                                  id="city" // Add an id for accessibility
                                  name="city" // Name should match the field name in initialValues
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.city}
                                  labelId="city"
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {Cities?.map((city) => (
                                    <MenuItem value={city?.recordGuid}>
                                      {city?.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              {formik.touched.city && formik.errors.city && (
                                <FormHelperText style={{ color: "red" }}>
                                  {formik.errors.city}
                                </FormHelperText>
                              )}
                            </Grid>

                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"state"}
                                  fullWidth
                                  id={"state"}
                                  name={"state"}
                                  label={"State"}
                                  variant="standard"
                                  type={"text"}
                                  value={formik.values["state"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["state"] &&
                                    Boolean(formik.errors["state"])
                                  }
                                  helperText={
                                    formik.touched["state"] &&
                                    formik.errors["state"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"street"}
                                  fullWidth
                                  id={"street"}
                                  name={"street"}
                                  label={"Street"}
                                  variant="standard"
                                  type={"text"}
                                  value={formik.values["street"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["street"] &&
                                    Boolean(formik.errors["street"])
                                  }
                                  helperText={
                                    formik.touched["street"] &&
                                    formik.errors["street"]
                                  }
                                />
                              </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"zip"}
                                  fullWidth
                                  id={"zip"}
                                  name={"zip"}
                                  label={"zip"}
                                  variant="standard"
                                  type={"text"}
                                  value={formik.values["zip"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["zip"] &&
                                    Boolean(formik.errors["zip"])
                                  }
                                  helperText={
                                    formik.touched["zip"] &&
                                    formik.errors["zip"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"building"}
                                  fullWidth
                                  id={"building"}
                                  name={"building"}
                                  label={"Building"}
                                  variant="standard"
                                  type={"text"}
                                  value={formik.values["building"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["building"] &&
                                    Boolean(formik.errors["building"])
                                  }
                                  helperText={
                                    formik.touched["building"] &&
                                    formik.errors["building"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"floor"}
                                  fullWidth
                                  id={"floor"}
                                  name={"floor"}
                                  label={"Floor"}
                                  variant="standard"
                                  type={"number"}
                                  value={formik.values["floor"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["floor"] &&
                                    Boolean(formik.errors["floor"])
                                  }
                                  helperText={
                                    formik.touched["floor"] &&
                                    formik.errors["floor"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"room"}
                                  fullWidth
                                  id={"room"}
                                  name={"room"}
                                  label={"Room"}
                                  variant="standard"
                                  type={"number"}
                                  value={formik.values["room"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["room"] &&
                                    Boolean(formik.errors["room"])
                                  }
                                  helperText={
                                    formik.touched["room"] &&
                                    formik.errors["room"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"address1"}
                                  fullWidth
                                  id={"address1"}
                                  name={"address1"}
                                  label={"Address Line 1"}
                                  variant="standard"
                                  type={"text"}
                                  value={formik.values["address1"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["address1"] &&
                                    Boolean(formik.errors["address1"])
                                  }
                                  helperText={
                                    formik.touched["address1"] &&
                                    formik.errors["address1"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl variant="standard" fullWidth>
                                <TextField
                                  key={"address2"}
                                  fullWidth
                                  id={"address2"}
                                  name={"address2"}
                                  label={"Address Line 2"}
                                  variant="standard"
                                  type={"text"}
                                  value={formik.values["address2"]}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched["address2"] &&
                                    Boolean(formik.errors["address2"])
                                  }
                                  helperText={
                                    formik.touched["address2"] &&
                                    formik.errors["address2"]
                                  }
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </AccordionComponent>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* {activeStep == 1 && (
                <Box>
                  <Grid container className="mt-4">
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<MuiCheckbox />}
                        label={"View PEId and TemplateId"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<MuiCheckbox />}
                        label={"Is Admin"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<MuiCheckbox />}
                        label={"Countries DND"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<MuiCheckbox />}
                        label={"Is Document Required"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<MuiCheckbox />}
                        label={"Delivery Status Notification"}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
  
              {activeStep == 2 && (
                <Box>
                  <Grid container className="mt-4">
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel id="client_type">
                          Select account type
                        </InputLabel>
                        <Select
                          labelId="client_type"
                          name="accountType"
                          value={formik?.values?.accountType}
                          onChange={formik?.handleChange}
                        >
                          <MenuItem value="prepaid">Prepaid</MenuItem>
                          <MenuItem value="postpaid">Postpaid</MenuItem>
                        </Select>
                        {formik.touched.accountType &&
                          formik.errors.accountType && (
                            <FormHelperText style={{ color: "red" }}>
                              {formik.errors.accountType}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  {formik?.values?.accountType == "postpaid" && (
                    <Grid
                      className="mt-4"
                      container
                      direction={"row"}
                      justifyContent={"space-between"}
                    >
                      <Grid item xs={5}>
                        <TextField
                          variant="standard"
                          fullWidth
                          label={`${"Credit limit"}`}
                          type="number"
                          inputProps={{
                            min: 0,
                            max: 100,
                            step: 0.01,
                          }}
                          value={field1Value}
                          onChange={handleField1Change}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )} */}

              {activeStep === 1 && (
                <Box>
                  <Grid container gap={2}>
                    <Grid container direction={"row"} gap={2}>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"BillingEmail"}
                            fullWidth
                            id={"BillingEmail"}
                            name={"BillingEmail"}
                            label={"Billing Email"}
                            variant="standard"
                            type={"text"}
                            value={formik.values.BillingEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.BillingEmail &&
                              Boolean(formik.errors.BillingEmail)
                            }
                            helperText={
                              formik.touched.BillingEmail &&
                              formik.errors.BillingEmail
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"TechnicalEmail"}
                            fullWidth
                            id={"TechnicalEmail"}
                            name={"TechnicalEmail"}
                            label={"Technical Email"}
                            variant="standard"
                            type={"text"}
                            value={formik.values.TechnicalEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.TechnicalEmail &&
                              Boolean(formik.errors.TechnicalEmail)
                            }
                            helperText={
                              formik.touched.TechnicalEmail &&
                              formik.errors.TechnicalEmail
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container direction={"row"} gap={2}>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"AlertsEmail"}
                            fullWidth
                            id={"AlertsEmail"}
                            name={"AlertsEmail"}
                            label={"Alerts Email"}
                            variant="standard"
                            type={"text"}
                            value={formik.values.AlertsEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.AlertsEmail &&
                              Boolean(formik.errors.AlertsEmail)
                            }
                            helperText={
                              formik.touched.AlertsEmail &&
                              formik.errors.AlertsEmail
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"BusinessWebUrl"}
                            fullWidth
                            id={"BusinessWebUrl"}
                            name={"BusinessWebUrl"}
                            label={"BusinessWebUrl"}
                            variant="standard"
                            type={"text"}
                            value={formik.values.BusinessWebUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.BusinessWebUrl &&
                              Boolean(formik.errors.BusinessWebUrl)
                            }
                            helperText={
                              formik.touched.BusinessWebUrl &&
                              formik.errors.BusinessWebUrl
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Grid
                display={"flex"}
                flexDirection={"row"}
                style={{ width: "85%", marginTop: 20 }}
                justifyContent={"space-between"}
              >
                <Button
                  onClick={handleBack}
                  disabled={activeStep == 0}
                  className="mui-btn secondary filled"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  className="mui-btn secondary filled"
                  onClick={formik?.handleSubmit}
                >
                  {activeStep === steps.length - 1 ? "Save" : "Continue"}
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default withTranslation("translation")(ProfileInfo);
