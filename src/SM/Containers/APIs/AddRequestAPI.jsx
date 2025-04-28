import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Step,
  Stepper,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ADD_SMS_API, GET_COUNTRIES } from "../../../APIs/SMSAPIS";
import stepper1 from "../../../../Assets/Images/stepper1.svg";
import stepper2 from "../../../../Assets/Images/stepper2.svg";
import stepper3 from "../../../../Assets/Images/stepper3.svg";
import stepper4 from "../../../../Assets/Images/stepper4.svg";
import { HandleApiError, handleMessageError } from "../../../Utils/Functions";
import { validationSchema } from "./SMSAPIValidation";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import MuiModal from "../../../../Components/MuiModal/MuiModal";

const AddRequestAPI = (props) => {
  let { channels } = useSelector((state) => state?.system);
  const [toggleShowToken, setToggleShowToken] = useState({
    token: "",
    toggle: false,
  });
  const [state, setState] = useState({
    activeTab: 0,
    name: "",
    description: "",
    countryCode: "",
    countryCodeOptions: [],
    enableNumberConvertion: false,
    enableIpProtection: false,
    isDeliveryApi: false,
    apiWhiteList: [{ Ip: "" }],
    apiUrl: "",
    apiUsername: "",
    apiPassword: "",
  });

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    document
      .querySelectorAll("input")
      .forEach((input) => (input.autocomplete = "off"));
    getCountries();
  }, []);

  let { token } = useSelector((state) => state?.authentication);

  const getCountries = async () => {
    try {
      let response = await GET_COUNTRIES({
        token: props.token,
      });
      setState((prevState) => ({
        ...prevState,
        countryCodeOptions:
          response?.data?.data?.countries?.map(
            ({ name, isoCode, recordGuid }) => ({
              name: name + " " + isoCode,
              value: recordGuid,
            })
          ) || [],
      }));
    } catch (e) {
      HandleApiError(e);
    }
  };

  const ValidateIPaddress = (Ip) => {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        Ip
      )
    )
      return true;
    return false;
  };

  const { activeTab } = state;

  const { t, isTablet, isMobile } = props;

  const steps = ["Details", "Settings", "Save Integration"];

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      countryCode: "",
      countryCodeOptions: [],
      enableNumberConvertion: false,
      enableIpProtection: false,
      isDeliveryApi: false,
      apiWhiteList: [],
      apiUrl: "",
      apiUsername: "",
      apiPassword: "",
    },
    validationSchema: validationSchema[activeTab],
    onSubmit: () => {
      if (activeTab === steps.length - 1) {
        createAPI();
      } else {
        if (activeTab == 2 && formik.values.enableIpProtection) {
          if (formik.values.apiWhiteList.length > 0 && checkList()) {
            setState((prevState) => ({
              ...prevState,
              activeTab: activeTab + 1,
            }));
          }
        } else if (activeTab == 2 && formik.values.isDeliveryApi) {
          if (
            formik.values.apiUsername.trim() != "" &&
            formik.values.apiPassword.trim() == ""
          ) {
            showSnackbar("Password is Required", "error");
          } else if (
            formik.values.apiUsername.trim() == "" &&
            formik.values.apiPassword.trim() != ""
          ) {
            showSnackbar("Username is Required", "error");
          } else {
            setState((prevState) => ({
              ...prevState,
              activeTab: activeTab + 1,
            }));
          }
        } else {
          setState((prevState) => ({
            ...prevState,
            activeTab: activeTab + 1,
          }));
        }
      }
    },
  });

  const endPage = () => {
    const { setToggleAddIntegration, getAPIs } = props;
    setToggleAddIntegration(false);
    getAPIs({});
  };

  const createAPI = async () => {
    const {
      name,
      description,
      enableNumberConvertion,
      enableIpProtection,
      countryCode,
      apiWhiteList,
      apiUrl,
      apiUsername,
      apiPassword,
      isDeliveryApi,
    } = formik.values;
    const { t, setLoading, getAPIs } = props;
    setLoading(true);
    const postData = {
      ApiListGuid: props?.dataID,
      ChannelGuid: props?.service?.channel?.recordGuid,
      name,
      Username: isDeliveryApi ? apiUsername : "",
      Password: isDeliveryApi ? apiPassword : "",
      url: isDeliveryApi ? apiUrl : "",
      isProtectedIp: enableIpProtection,
      description: description,
      ApiWhiteIpList: enableIpProtection ? apiWhiteList : [],
      ConvertInternationalFormat: enableNumberConvertion,
      CountryGuid: countryCode ? countryCode.toString() : null,
      ServiceTag: props?.service?.tag,
    };
    try {
      let response = await ADD_SMS_API({
        token,
        postData,
      });
      showSnackbar(t(response?.data?.message || "Successfully Added API"));
      setToggleShowToken({
        token: response?.data?.data?.api?.accessToken,
        toggle: true,
      });
      getAPIs({});
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadToken = () => {
    const content = toggleShowToken?.token;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Access Token.txt";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    endPage();
  };

  const checkList = () => {
    for (var i = 0; i < formik.values.apiWhiteList.length; i++) {
      if (formik.values.apiWhiteList[i]?.Ip == "") {
        showSnackbar("IP " + (i + 1) + " is required", "error");
        return false;
      }
      if (!ValidateIPaddress(formik.values.apiWhiteList[i]?.Ip)) {
        showSnackbar("IP " + (i + 1) + " is invalid", "error");
        return false;
      }
    }
    return true;
  };

  return (
    <Grid container spacing={2} id="addRequestAPI">
      {!isMobile && (
        <Grid item xs="4" boxShadow={"1px 0px 1px #88888850"}>
          <Grid container height={"100%"}>
            <Grid item xs={isTablet ? "0" : "12"}>
              <Stepper activeStep={activeTab} className={"mt-4 pt-0"}>
                {steps.map((label, index) => {
                  return (
                    <Step key={index}>
                      <a
                        // onClick={() =>
                        //   setState((prevState) => ({
                        //     ...prevState,
                        //     activeTab: index,
                        //   }))
                        // }
                        style={{ cursor: "default" }}
                      >
                        <span
                          className={
                            activeTab == index ? "circle text-circle" : ""
                          }
                        >
                          {index + 1}
                        </span>
                      </a>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
            <Grid
              item
              xs="12"
              display="flex"
              flexDirection={"column"}
              alignItems={"center"}
            >
              {activeTab == 0 && (
                <div>
                  <img src={stepper1} alt="stepper 1" className="p-4 ml-1" />
                </div>
              )}
              {activeTab == 1 && (
                <div>
                  <img src={stepper2} alt="stepper 2" className="p-4 ml-1" />
                </div>
              )}
              {activeTab == 2 && (
                <div>
                  <img src={stepper3} alt="stepper 3" className="p-4 ml-1" />
                </div>
              )}
              {activeTab == 3 && (
                <div>
                  <img src={stepper4} alt="stepper 4" className="p-4 ml-1" />
                </div>
              )}

              <p>
                <b>{t("New API Integration")}</b>
              </p>
              <p className="text-center">
                {t(
                  "Fill out the form. You can always edit the data in the action menu."
                )}
              </p>
            </Grid>
          </Grid>
        </Grid>
      )}
      {isTablet && <hr className="mx-5 w-100" />}
      <Grid item xs={`${isMobile ? 12 : 8}`}>
        <form
          onSubmit={formik?.handleSubmit}
          style={{ height: "500px", overflowY: "auto" }}
        >
          <Grid container spacing={2} height={"100%"}>
            {activeTab == 0 && (
              <Grid item xs={12}>
                <h5 className="pb-3">API Information</h5>
                <FormControl className="pb-3" fullWidth variant="standard">
                  <TextField
                    variant="standard"
                    label={t("Integration Name*")}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    name="name"
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["name"] && Boolean(formik.errors["name"])
                    }
                    helperText={formik.touched["name"] && formik.errors["name"]}
                    maxLength={50}
                  />
                </FormControl>
                <FormControl fullWidth variant="standard">
                  <TextField
                    multiline
                    rows={3}
                    variant="standard"
                    label={t("Description")}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    name="description"
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["description"] &&
                      Boolean(formik.errors["description"])
                    }
                    helperText={
                      formik.touched["description"] &&
                      formik.errors["description"]
                    }
                    maxLength={50}
                  />
                </FormControl>
              </Grid>
            )}
            {activeTab == 1 && (
              <Grid item xs={12}>
                <h5 className="pb-3">Setup Information</h5>
                <FormControlLabel
                  label={t("Convert Mobile Number into International Format")}
                  control={
                    <Checkbox
                      checked={formik.values.enableNumberConvertion}
                      name="enableNumberConvertion"
                      onChange={formik.handleChange}
                      onClick={() => {
                        formik.setFieldValue("countryCode", "");
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched["enableNumberConvertion"] &&
                        Boolean(formik.errors["enableNumberConvertion"])
                      }
                      helperText={
                        formik.touched["enableNumberConvertion"] &&
                        formik.errors["enableNumberConvertion"]
                      }
                    />
                  }
                />
                <p className="text-muted">
                  {t(
                    "Specify the Country that you are sending messages to and we'll automatically convert your number to the correct international format before sending"
                  )}
                </p>
                {formik.values.enableNumberConvertion && (
                  <FormControl className="pb-2" fullWidth variant="standard">
                    <InputLabel
                      id="demo-simple-select-label"
                      error={
                        formik.touched["countryCode"] &&
                        Boolean(formik.errors["countryCode"])
                      }
                    >
                      {t("Select Country")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      variant="standard"
                      name="countryCode"
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched["countryCode"] &&
                        Boolean(formik.errors["countryCode"])
                      }
                      helperText={
                        formik.touched["countryCode"] &&
                        formik.errors["countryCode"]
                      }
                      value={formik.values.countryCode}
                      onChange={formik.handleChange}
                    >
                      {state?.countryCodeOptions?.map((template) => (
                        <MenuItem value={template?.value}>
                          {template?.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.countryCode &&
                      formik.errors.countryCode && (
                        <FormHelperText style={{ color: "red" }}>
                          {formik.errors.countryCode}
                        </FormHelperText>
                      )}
                  </FormControl>
                )}
                <FormControlLabel
                  label={t("Protect my Account from Fraud")}
                  control={
                    <Checkbox
                      checked={formik.values.enableIpProtection}
                      name="enableIpProtection"
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          formik.setValues({
                            ...formik.values,
                            apiWhiteList: [{ Ip: "" }],
                          });
                        } else {
                          formik.setValues({
                            ...formik.values,
                            apiWhiteList: [],
                          });
                        }
                        formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched["enableIpProtection"] &&
                        Boolean(formik.errors["enableIpProtection"])
                      }
                      helperText={
                        formik.touched["enableIpProtection"] &&
                        formik.errors["enableIpProtection"]
                      }
                    />
                  }
                />
                <p className="text-muted">
                  {t(
                    "Enable whitelist of IP Addresses that may send messages from your Account."
                  )}
                </p>
                {formik.values.enableIpProtection &&
                  formik.values.apiWhiteList?.map(({ Ip }, index, array) => (
                    <fieldset
                      key={index}
                      className="border position-relative p-2 mb-2"
                    >
                      <legend className="w-auto mb-0">
                        <small className="text-primary">
                          {t("IP")} {index + 1}
                        </small>
                      </legend>
                      <Grid container spacing={2}>
                        <Grid item md="12">
                          <FormControl fullWidth variant="standard">
                            <TextField
                              variant="standard"
                              label={t("IP Address")}
                              onChange={({ target: { value } }) => {
                                array[index].Ip = new RegExp(
                                  /^\d*\.?\d*\.?\d*\.?\d*\.?$/
                                ).test(value)
                                  ? value
                                  : array[index].Ip;
                                formik.setValues({
                                  ...formik.values,
                                  apiWhiteList: array,
                                });
                              }}
                              value={Ip}
                              name="Ip"
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched["Ip"] &&
                                Boolean(formik.errors["Ip"])
                              }
                              helperText={
                                formik.touched["Ip"] && formik.errors["Ip"]
                              }
                              maxLength={50}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      {index === 0 ? (
                        <>
                          {array.length <= 9 ? (
                            <>
                              <button
                                type="button"
                                className="p-0"
                                color="dark"
                                onClick={() => {
                                  if (checkList()) {
                                    formik.setValues({
                                      ...formik.values,
                                      apiWhiteList: [
                                        ...formik.values.apiWhiteList,
                                        { Ip: "" },
                                      ],
                                    });
                                  }
                                }}
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "16px",
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  border: "none",
                                }}
                              >
                                <AddCircleOutlineIcon fontSize="small" />
                              </button>
                              {array.length > 1 && (
                                <button
                                  type="button"
                                  className="p-0"
                                  onClick={() => {
                                    let TempArray = formik.values.apiWhiteList;
                                    let newArray = TempArray.splice(index, 1);
                                    formik.setValues({
                                      ...formik.values,
                                      apiWhiteList: TempArray,
                                    });
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "72px",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    border: "none",
                                  }}
                                >
                                  <HighlightOffIcon fontSize="small" />
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              className="p-0"
                              onClick={() => {
                                let TempArray = formik.values.apiWhiteList;
                                let newArray = TempArray.splice(index, 1);
                                formik.setValues({
                                  ...formik.values,
                                  apiWhiteList: TempArray,
                                });
                              }}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "16px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                border: "none",
                              }}
                            >
                              <HighlightOffIcon fontSize="small" />
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {array.length > 1 && (
                            <button
                              type="button"
                              className="p-0"
                              onClick={() => {
                                let TempArray = formik.values.apiWhiteList;
                                let newArray = TempArray.splice(index, 1);
                                formik.setValues({
                                  ...formik.values,
                                  apiWhiteList: TempArray,
                                });
                              }}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "16px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                border: "none",
                              }}
                            >
                              <HighlightOffIcon fontSize="small" />
                            </button>
                          )}
                        </>
                      )}
                    </fieldset>
                  ))}
                <FormControlLabel
                  label={t("Delivery Notifications")}
                  control={
                    <Checkbox
                      checked={formik.values.isDeliveryApi}
                      name="isDeliveryApi"
                      onChange={formik.handleChange}
                      onClick={() => {
                        formik.setFieldValue("apiUrl", "");
                        formik.setFieldValue("apiUsername", "");
                        formik.setFieldValue("apiPassword", "");
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched["isDeliveryApi"] &&
                        Boolean(formik.errors["isDeliveryApi"])
                      }
                      helperText={
                        formik.touched["isDeliveryApi"] &&
                        formik.errors["isDeliveryApi"]
                      }
                    />
                  }
                />
                <p className="text-muted">
                  {t(
                    "Enable Delivery Notifications:SMS Delivery Notifications will be passed from the API to your Website or Server."
                  )}
                </p>
                {formik.values.isDeliveryApi && (
                  <div>
                    <FormControl className="pb-3" fullWidth variant="standard">
                      <TextField
                        variant="standard"
                        label={t("Enter URL")}
                        onChange={formik.handleChange}
                        value={formik.values.apiUrl}
                        name="apiUrl"
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched["apiUrl"] &&
                          Boolean(formik.errors["apiUrl"])
                        }
                        helperText={
                          formik.touched["apiUrl"] && formik.errors["apiUrl"]
                        }
                        maxLength={50}
                      />
                    </FormControl>
                    <p>
                      <b>
                        Credentials for basic http authentication (optional)
                      </b>
                    </p>
                    <Grid container spacing={2}>
                      <Grid item xs="6">
                        <FormControl
                          className="pb-3"
                          fullWidth
                          variant="standard"
                        >
                          <TextField
                            variant="standard"
                            label={t("Username")}
                            onChange={formik.handleChange}
                            value={formik.values.apiUsername}
                            name="apiUsername"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["apiUsername"] &&
                              Boolean(formik.errors["apiUsername"])
                            }
                            helperText={
                              formik.touched["apiUsername"] &&
                              formik.errors["apiUsername"]
                            }
                            maxLength={50}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs="6">
                        <FormControl
                          className="pb-3"
                          fullWidth
                          variant="standard"
                        >
                          <TextField
                            variant="standard"
                            label={t("Password")}
                            onChange={formik.handleChange}
                            value={formik.values.apiPassword}
                            name="apiPassword"
                            type="password"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["apiPassword"] &&
                              Boolean(formik.errors["apiPassword"])
                            }
                            helperText={
                              formik.touched["apiPassword"] &&
                              formik.errors["apiPassword"]
                            }
                            maxLength={50}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </Grid>
            )}
            {activeTab == 2 && (
              <Grid item xs={12}>
                <h5 className="pb-3">Preview Filled Information</h5>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={t("Integration Name")}
                      secondary={formik.values.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={t("Description")}
                      secondary={formik.values.description}
                    />
                  </ListItem>
                  {formik.values.enableNumberConvertion && (
                    <ListItem>
                      <ListItemText
                        primary="Country"
                        secondary={
                          state?.countryCodeOptions?.find(
                            (item) => item?.value == formik.values.countryCode
                          )?.name
                        }
                      />
                    </ListItem>
                  )}
                  {formik.values.enableIpProtection &&
                    formik.values.apiWhiteList.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`IP ${index + 1}`}
                          secondary={item.Ip}
                        />
                      </ListItem>
                    ))}
                  {formik.values.isDeliveryApi && (
                    <>
                      <ListItem>
                        <ListItemText
                          primary="URL"
                          secondary={formik.values.apiUrl}
                        />
                      </ListItem>
                      {formik.values.apiUsername !== "" && (
                        <ListItem>
                          <ListItemText
                            primary="UserName"
                            secondary={formik.values.apiUsername}
                          />
                        </ListItem>
                      )}
                    </>
                  )}
                </List>
              </Grid>
            )}
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              <Button
                onClick={() => {
                  if (activeTab > 0) {
                    setState((prevState) => ({
                      ...prevState,
                      activeTab: activeTab - 1,
                    }));
                  } else {
                    props.setToggleAddIntegration(false);
                  }
                }}
                className="mui-btn secondary filled"
              >
                Back
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Button
                variant="contained"
                className="mui-btn secondary filled"
                type="submit"
              >
                {activeTab === steps.length - 1 ? "Finish" : "Continue"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>

      <MuiModal
        open={toggleShowToken?.toggle}
        width={500}
        handleClose={() => {
          setToggleShowToken({
            token: "",
            toggle: false,
          });
          endPage();
        }}
        title={"Access Token"}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
              {toggleShowToken?.token}
            </p>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => downloadToken()}
              variant="contained"
              className="mui-btn secondary filled"
            >
              {"Download Token"}
            </Button>
          </Grid>
        </Grid>
      </MuiModal>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  token: state.authentication ? state.authentication.token : "",
});

export default connect(
  mapStateToProps,
  null
)(withTranslation("translations")(AddRequestAPI));
