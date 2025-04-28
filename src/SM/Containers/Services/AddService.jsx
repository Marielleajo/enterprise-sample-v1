import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { GET_ALL_CHANNELS, GET_CURRENCIES } from "../../../APIs/Criteria";
import {
  ADD_SERVICE,
  GET_ALL_SERVICE_CATEGORY,
  GET_ALL_SERVICE_TYPE,
  GET_PRICING_TYPES,
} from "../../../APIs/Services";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError, removeNullKeys } from "../../Utils/Functions";
import AddServiceFeatures from "./AddServiceFeatures";
import addValidationSchema from "./addValidationSchema";
import GetActions from "../../Utils/GetActions";

const AddService = ({ t }) => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [serviceCategoryOptions, setServiceCategoryOptions] = useState([]);
  const [serviceTypeOptions, setServiceTypeOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);
  const [pricingTypeOptions, setPricingTypeOptions] = useState([]);
  const [newServiceGuid, setNewServiceGuid] = useState("");

  const [steps, setSteps] = useState([
    {
      label: "Service Details",
    },
    {
      label: "Features",
    },
  ]);

  const [activeStep, setActiveStep] = useState(0);
  const { token } = useSelector((state) => state?.authentication);

  const handleBack = () => {
    if (activeStep == 0) {
      history?.push("/services/service-management");
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const getServiceCategories = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_SERVICE_CATEGORY();
      setServiceCategoryOptions(
        response?.data?.data?.items?.map((item) => ({
          label: item?.serviceCategoryDetails[0]?.name,
          value: item?.recordGuid,
        }))
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const getServiceTypes = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_SERVICE_TYPE();
      setServiceTypeOptions(
        response?.data?.data?.items?.map((item) => ({
          label: item?.serviceTypeDetails[0]?.name,
          value: item?.recordGuid,
        }))
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const getCurrencies = async () => {
    setLoading(true);
    try {
      let response = await GET_CURRENCIES();
      setCurrencyOptions(
        response?.data?.data?.currencies?.map((item) => ({
          label: item?.name,
          value: item?.code,
        }))
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const getChannels = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CHANNELS(token);
      setChannelOptions(response?.data?.data?.channels);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const getPricingTypes = async () => {
    setLoading(true);
    try {
      let data = {
        categoryTags: ["SERVICE_PRICING_TYPE"],
      };
      let response = await GET_PRICING_TYPES({ data });
      setPricingTypeOptions(
        response?.data?.data?.criteria?.map((item) => ({
          label: item?.name,
          value: item?.tag,
        }))
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceCategories();
    getServiceTypes();
    getCurrencies();
    getChannels();
    getPricingTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      serviceCategory: "",
      serviceType: "",
      currency: "",
      channels: [],
      pricingType: "",
      defaultCost: "",
      defaultSell: "",
      broadcast: false,
      integration: false,
      api: false,
      generateApi: false,
      template: false,
      channelManagement: false,
      analyze: false,
      report: false,
    },
    validationSchema: addValidationSchema[0],
    onSubmit: async (values) => {
      if (activeStep === 0) {
        setLoading(true);
        try {
          let data = {};
          if (values?.pricingType !== "TRAFFIC") {
            data = {
              serviceCategoryGuid: values?.serviceCategory,
              ServiceTypeGuid: values?.serviceType,
              currencyCode: values?.currency,
              PriceTypeTag: values?.pricingType,
              price: values?.defaultSell,
              cost: values?.defaultCost,
              ServiceInfo: {
                NumberOfSubscription: 0,
                NumberOfUnSubscription: 0,
              },
              serviceDetails: [
                {
                  languageCode: "en",
                  name: values?.name,
                  description: values?.description,
                },
              ],
              ServiceConfig: [
                {
                  key: "isBroadcast",
                  value: values?.broadcast ? "true" : "false",
                },
                {
                  key: "isIntegration",
                  value: values?.integration ? "true" : "false",
                },
                {
                  key: "IsAPI",
                  value: values?.api ? "true" : "false",
                },
                {
                  key: "IsGenerateCDR",
                  value: values?.generateApi ? "true" : "false",
                },

                {
                  key: "IsTemplate",
                  value: values?.template ? "true" : "false",
                },
                {
                  key: "IsChannelManagement",
                  value: values?.channelManagement ? "true" : "false",
                },
                {
                  key: "IsAnalyze",
                  value: values?.analyze ? "true" : "false",
                },
                {
                  key: "IsReport",
                  value: values?.report ? "true" : "false",
                },
              ],
            };
          } else {
            data = {
              serviceCategoryGuid: values?.serviceCategory,
              ServiceTypeGuid: values?.serviceType,
              currencyCode: values?.currency,
              PriceTypeTag: values?.pricingType,
              ServiceInfo: {
                NumberOfSubscription: 0,
                NumberOfUnSubscription: 0,
              },
              serviceDetails: [
                {
                  languageCode: "en",
                  name: values?.name,
                  description: values?.description,
                },
              ],
              ServiceConfig: [
                {
                  key: "isBroadcast",
                  value: values?.broadcast ? "true" : "false",
                },
                {
                  key: "isIntegration",
                  value: values?.integration ? "true" : "false",
                },
                {
                  key: "IsAPI",
                  value: values?.api ? "true" : "false",
                },
                {
                  key: "IsGenerateCDR",
                  value: values?.generateApi ? "true" : "false",
                },
                {
                  key: "IsTemplate",
                  value: values?.template ? "true" : "false",
                },
                {
                  key: "IsChannelManagement",
                  value: values?.channelManagement ? "true" : "false",
                },
                {
                  key: "IsAnalyze",
                  value: values?.analyze ? "true" : "false",
                },
                {
                  key: "IsReport",
                  value: values?.report ? "true" : "false",
                },
              ],
            };
          }

          if (values.channels.length == 1) {
            data = { ...data, ChannelGuid: values?.channels[0] };
          } else {
            data = { ...data, ChannelGuids: values?.channels };
          }

          let response = await ADD_SERVICE({ postData: removeNullKeys(data) });
          if (response?.data?.success) {
            showSnackbar("Service Added Successfully!");
            setNewServiceGuid(response?.data?.data?.item?.recordGuid);
            setActiveStep(activeStep + 1);
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      } else {
        history.push("/services/service-management");
      }
    },
  });

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue(e?.target?.name, value);
    }
  };

  const theme = useTheme();

  return (
    <Grid container id="Reseller" className="page_container">
      <Grid container>
        <Grid item xs={12} className="pt-4">
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
            <Typography
              style={{
                cursor: "pointer",
              }}
              className="BreadcrumbsPage"
              onClick={() => history.push("/services/service-management")}
            >
              Services
            </Typography>
            <Typography className="breadcrumbactiveBtn">
              Manage Service
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container className="section_container scroll">
        <Grid item xs={2}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            className="pt-4"
          >
            {steps?.map((step, index) => {
              return (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === steps.length - 1 ? (
                        <Typography variant="caption">Last step</Typography>
                      ) : null
                    }
                  >
                    {step?.label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Grid>

        <Grid item xs={9} className="sub_section_container">
          <Box className="pt-4">
            <Typography variant="h5"> {steps[activeStep]?.label}</Typography>
          </Box>
          <form onSubmit={formik?.handleSubmit}>
            {activeStep === 0 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                      <TextField
                        key={"name"}
                        fullWidth
                        id={"name"}
                        name={"name"}
                        label={"Name*"}
                        variant="standard"
                        type={"text"}
                        value={formik.values["name"]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched["name"] &&
                          Boolean(formik.errors["name"])
                        }
                        helperText={
                          formik.touched["name"] && formik.errors["name"]
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                      <TextField
                        key={"description"}
                        fullWidth
                        id={"description"}
                        name={"description"}
                        label={"Description*"}
                        variant="standard"
                        type={"text"}
                        value={formik.values["description"]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched["description"] &&
                          Boolean(formik.errors["description"])
                        }
                        helperText={
                          formik.touched["description"] &&
                          formik.errors["description"]
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel
                        error={
                          formik.touched["serviceCategory"] &&
                          Boolean(formik.errors["serviceCategory"])
                        }
                        id="serviceCategory"
                      >
                        Service Category*
                      </InputLabel>
                      <Select
                        id="serviceCategory"
                        name="serviceCategory"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched["serviceCategory"] &&
                          Boolean(formik.errors["serviceCategory"])
                        }
                        value={formik.values.serviceCategory}
                        labelId="serviceCategory"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {serviceCategoryOptions?.map((item) => (
                          <MenuItem value={item?.value}>{item?.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.serviceCategory &&
                      formik.errors.serviceCategory && (
                        <FormHelperText
                          style={{ color: theme?.palette?.error?.main }}
                        >
                          {formik.errors.serviceCategory}
                        </FormHelperText>
                      )}
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel
                        error={
                          formik.touched["serviceType"] &&
                          Boolean(formik.errors["serviceType"])
                        }
                        id="serviceType"
                      >
                        Service Type*
                      </InputLabel>
                      <Select
                        id="serviceType"
                        name="serviceType"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched["serviceType"] &&
                          Boolean(formik.errors["serviceType"])
                        }
                        value={formik.values.serviceType}
                        labelId="serviceType"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {serviceTypeOptions?.map((item) => (
                          <MenuItem value={item?.value}>{item?.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.serviceType &&
                      formik.errors.serviceType && (
                        <FormHelperText
                          style={{ color: theme?.palette?.error?.main }}
                        >
                          {formik.errors.serviceType}
                        </FormHelperText>
                      )}
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel
                        error={
                          formik.touched["currency"] &&
                          Boolean(formik.errors["currency"])
                        }
                        id="currency"
                      >
                        Currency*
                      </InputLabel>
                      <Select
                        id="currency"
                        name="currency"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched["currency"] &&
                          Boolean(formik.errors["currency"])
                        }
                        value={formik.values.currency}
                        labelId="currency"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {currencyOptions?.map((item) => (
                          <MenuItem value={item?.value}>{item?.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.currency && formik.errors.currency && (
                      <FormHelperText
                        style={{ color: theme?.palette?.error?.main }}
                      >
                        {formik.errors.currency}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      error={
                        formik?.touched["channels"] &&
                        formik.values.channels.length == 0 &&
                        Boolean(formik?.errors["channels"])
                      }
                    >
                      <InputLabel id="channels-label">Channels *</InputLabel>
                      <Select
                        multiple
                        key="channels"
                        id="channels"
                        name="channels"
                        label="channels"
                        labelId="channels-label"
                        onChange={(e) => {
                          formik?.setFieldValue("channels", e.target.value);
                        }}
                        value={formik?.values?.channels || []}
                        renderValue={(selected) =>
                          selected
                            .map(
                              (rg) =>
                                channelOptions?.find(
                                  (channels) => channels.recordGuid == rg
                                )?.name
                            )
                            .join(", ")
                        }
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: 250,
                            },
                          },
                        }}
                      >
                        {channelOptions?.map((item) => (
                          <MenuItem
                            key={item?.recordGuid}
                            value={item?.recordGuid}
                          >
                            <Checkbox
                              checked={formik?.values?.channels?.includes(
                                item?.recordGuid
                              )}
                              sx={{
                                color: "#d32f2f",
                                "&.Mui-checked": {
                                  color: "#d32f2f",
                                },
                              }}
                            />
                            {item?.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik?.touched["channels"] &&
                        formik?.errors["channels"] && (
                          <FormHelperText style={{ color: "#d32f2f" }}>
                            {formik?.errors["channels"]}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel
                        error={
                          formik.touched["pricingType"] &&
                          Boolean(formik.errors["pricingType"])
                        }
                        id="pricingType"
                      >
                        Pricing Type*
                      </InputLabel>
                      <Select
                        id="pricingType"
                        name="pricingType"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched["pricingType"] &&
                          Boolean(formik.errors["pricingType"])
                        }
                        value={formik.values.pricingType}
                        labelId="pricingType"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {pricingTypeOptions?.map((item) => (
                          <MenuItem value={item?.value}>{item?.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formik.touched.pricingType &&
                      formik.errors.pricingType && (
                        <FormHelperText
                          style={{ color: theme?.palette?.error?.main }}
                        >
                          {formik.errors.pricingType}
                        </FormHelperText>
                      )}
                  </Grid>
                  {formik.values.pricingType !== "TRAFFIC" &&
                    formik.values.pricingType !== "" && (
                      <>
                        <Grid item xs={4}>
                          <FormControl variant="standard" fullWidth>
                            <TextField
                              key={"defaultCost"}
                              fullWidth
                              id={"defaultCost"}
                              name={"defaultCost"}
                              label={"Default Cost*"}
                              variant="standard"
                              type={"text"}
                              value={formik.values["defaultCost"]}
                              onChange={handleNumberChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched["defaultCost"] &&
                                Boolean(formik.errors["defaultCost"])
                              }
                              helperText={
                                formik.touched["defaultCost"] &&
                                formik.errors["defaultCost"]
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl variant="standard" fullWidth>
                            <TextField
                              key={"defaultSell"}
                              fullWidth
                              id={"defaultSell"}
                              name={"defaultSell"}
                              label={"Default Sell*"}
                              variant="standard"
                              type={"text"}
                              value={formik.values["defaultSell"]}
                              onChange={handleNumberChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched["defaultSell"] &&
                                Boolean(formik.errors["defaultSell"])
                              }
                              helperText={
                                formik.touched["defaultSell"] &&
                                formik.errors["defaultSell"]
                              }
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                  {(formik.values.pricingType == "TRAFFIC" ||
                    formik.values.pricingType == "") && <Grid item xs={8} />}

                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        Broadcast
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.broadcast}
                            onChange={() =>
                              formik?.setFieldValue(
                                "broadcast",
                                !formik?.values?.broadcast
                              )
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        Integration
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.integration}
                            onChange={() =>
                              formik?.setFieldValue(
                                "integration",
                                !formik?.values?.integration
                              )
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        API
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.api}
                            onChange={() =>
                              formik?.setFieldValue("api", !formik?.values?.api)
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        Generate API
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.generateApi}
                            onChange={() =>
                              formik?.setFieldValue(
                                "generateApi",
                                !formik?.values?.generateApi
                              )
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        Template
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.template}
                            onChange={() =>
                              formik?.setFieldValue(
                                "template",
                                !formik?.values?.template
                              )
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        Channel Management
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.channelManagement}
                            onChange={() =>
                              formik?.setFieldValue(
                                "channelManagement",
                                !formik?.values?.channelManagement
                              )
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        Analyze
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.analyze}
                            onChange={() =>
                              formik?.setFieldValue(
                                "analyze",
                                !formik?.values?.analyze
                              )
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        marginBottom: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <span
                        style={{
                          color: "#B3B3B3",
                          fontSize: "15px",
                          marginRight: "20px",
                        }}
                      >
                        Report
                      </span>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik?.values?.report}
                            onChange={() =>
                              formik?.setFieldValue(
                                "report",
                                !formik?.values?.report
                              )
                            }
                          />
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && newServiceGuid != "" && (
              <AddServiceFeatures type="add" selectedService={newServiceGuid} />
            )}

            <Grid
              display={"flex"}
              flexDirection={"row"}
              style={{ marginTop: 20 }}
              justifyContent={
                activeStep !== steps.length - 1 ? "space-between" : "end"
              }
            >
              {activeStep !== steps.length - 1 && (
                <Button
                  onClick={handleBack}
                  className="mui-btn secondary filled"
                >
                  Back
                </Button>
              )}
              <Button
                className="mui-btn primary filled"
                onClick={formik?.handleSubmit}
                disabled={loading}
              >
                {activeStep === steps.length - 1
                  ? "Finish"
                  : "Save and Continue"}
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withTranslation("translation")(GetActions(AddService));
