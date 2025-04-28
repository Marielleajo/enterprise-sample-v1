import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
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
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { TEST_BULK_API, TEST_SINGLE_API } from "../../../APIs/SMSAPIS";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import {
  validationSchemaGET,
  validationSchemaPOST,
} from "./SMSTestAPIValidation";
import CursorBody from "./CursorBody";
import { GET_ALL_SENDERS } from "../../../APIs/Sender";

const TestIntegratedAPI = (props) => {
  let { token } = useSelector((state) => state?.authentication);
  const [smsSendTypeOptions, setSmsSendTypeOptions] = useState([
    { value: "SHORT_CODE", label: "Short code" },
    { value: "LONG_CODE", label: "Long code" },
  ]);

  const { showSnackbar } = useSnackbar();
  const [state, setState] = useState({
    apisOptions: [],
    senderOptions: [],
    sampleCode: "",
  });

  const { t } = props;

  const formik = useFormik({
    initialValues: {
      apisOption: "",
      senderOption: "",
      phoneNumber: null,
      phoneNumbers: [
        {
          number: "",
        },
      ],
      sampleText: "",
      sampleCode: ``,
      canCopy: false,
      token: "",
      smsSendTypeOptions: "",
      service: props?.service.tag,
    },
    validationSchema:
      state?.apiTypeTag == "GET"
        ? validationSchemaGET[0]
        : validationSchemaPOST[0],
    onSubmit: () => {
      SubmitTestAPI();
    },
  });

  const addPhoneNumber = (e) => {
    e.preventDefault();
    let phoneNumberArray = [...formik.values.phoneNumbers, { number: "" }];
    formik.setFieldValue("phoneNumbers", phoneNumberArray);
  };

  const removePhoneNumber = (e, index) => {
    e.preventDefault();
    const { phoneNumbers } = formik.values;
    if (phoneNumbers.length > 1) {
      phoneNumbers.splice(index, 1);
      formik.setFieldValue("phoneNumbers", phoneNumbers);
    } else {
      formik.setFieldValue("phoneNumbers", [
        {
          number: "",
        },
      ]);
    }
  };

  useEffect(() => {
    const apisOptions =
      props?.Data?.filter((item) => item?.isRegistered == true)?.map(
        ({ name, recordGuid, typeTag }) => ({
          name: name,
          value: recordGuid,
          typeTag: typeTag,
        })
      ) || [];
    formik.setFieldValue("apisOptions", apisOptions);
    setState((prevState) => ({
      ...prevState,
      apisOptions,
    }));
    document
      .querySelectorAll("input")
      .forEach((input) => (input.autocomplete = "off"));
    if (props?.service.tag != "TWO_WAY_SMS") {
      getSenders({ service: props?.service.tag });
    }
  }, []);

  const getSenders = async ({ service, type }) => {
    try {
      let response = await GET_ALL_SENDERS({
        isAdmin: false,
        status: "APPROVED",
        pageSize: 1000,
        ServiceTag: service,
        TypeTag: type,
      });
      setState((prevState) => ({
        ...prevState,
        senderOptions:
          response?.data?.data?.senders?.map(({ name, recordGuid }) => ({
            name: name,
            value: recordGuid,
          })) || [],
      }));
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const SubmitTestAPI = async () => {
    const { apisOption, senderOption, phoneNumber, phoneNumbers, sampleText } =
      formik.values;
    const { t, setToggleTestIntegration, setLoading, getAPIs } = props;
    setLoading(true);
    if (state?.apiTypeTag == "GET") {
      try {
        let response = await TEST_SINGLE_API({
          token: formik?.values?.token,
          Destination: phoneNumber,
          Source: senderOption,
          Message: sampleText,
          ApiId: apisOption,
          test: false,
        });
        setToggleTestIntegration(false);
        showSnackbar(t(response?.data?.message || "Successfully Tested API"));
        getAPIs({});
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        setLoading(false);
      }
    } else {
      let newPhoneNumbers = phoneNumbers?.map((item) => item?.number);
      const postData = {
        Destination: newPhoneNumbers,
        Source: senderOption,
        Message: sampleText,
        ApiId: apisOption,
      };
      try {
        let response = await TEST_BULK_API({
          token,
          postData,
        });
        if (response?.data?.data?.sendSMSResponseItem[0]?.errorCode == 9) {
          setLoading(false);
          showSnackbar(
            t(
              response?.data?.data?.sendSMSResponseItem[0]?.description ||
                "Phone is blacklisted"
            )
          );
        } else {
          setToggleTestIntegration(false);
          showSnackbar(
            t(response?.data?.message || "Successfully Tested APIS")
          );
          getAPIs({});
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Unable to copy text to clipboard", err);
    }
  };

  const updateTextFieldAPIValue = (apiTypeTag, newValue) => {
    let newTextValue = "";
    if (apiTypeTag == "GET") {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-sms?Source=${
        formik.values.senderOption
      }&Destination=${formik.values.phoneNumber}&Message=${
        formik.values.sampleText
      }&ApiId=${newValue}`;
    } else {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-bulk-sms`;
    }
    setState((prevState) => ({
      ...prevState,
      sampleCode: newTextValue,
    }));
  };

  const updateTextFieldSenderValue = (newValue) => {
    let newTextValue = "";
    if (state?.apiTypeTag == "GET") {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-sms?Source=${newValue}&Destination=${
        formik.values.phoneNumber
      }&Message=${formik.values.sampleText}&ApiId=${formik.values.apisOption}`;
    } else {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-bulk-sms`;
    }
    setState((prevState) => ({
      ...prevState,
      sampleCode: newTextValue,
    }));
  };

  const updateTextFieldNumberValue = (newValue) => {
    let newTextValue = "";
    if (state?.apiTypeTag == "GET") {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-sms?Source=${
        formik.values.senderOption
      }&Destination=${newValue}&Message=${formik.values.sampleText}&ApiId=${
        formik.values.apisOption
      }`;
    } else {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-bulk-sms`;
    }
    setState((prevState) => ({
      ...prevState,
      sampleCode: newTextValue,
    }));
  };

  const updateTextFieldSampleTextValue = (newValue) => {
    let newTextValue = "";
    if (state?.apiTypeTag == "GET") {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-sms?Source=${
        formik.values.senderOption
      }&Destination=${formik.values.phoneNumber}&Message=${newValue}&ApiId=${
        formik.values.apisOption
      }`;
    } else {
      newTextValue = `https://mm-omni-api-software-${
        import.meta.env.REACT_APP_QA_OR_DEV
      }.montylocal.net/notification/api/v1/api/send-bulk-sms`;
    }
    setState((prevState) => ({
      ...prevState,
      sampleCode: newTextValue,
    }));
  };

  return (
    <Grid container id="addRequestAPI">
      <Grid item xs="12">
        <form
          onSubmit={formik?.handleSubmit}
          style={{ height: "600px", overflowY: "auto" }}
        >
          <Grid container spacing={2} height={"100%"}>
            <Grid
              item
              xs="12"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <p>
                {t(
                  "Please select the integration you would like to test from the dropdown below:"
                )}
              </p>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <FormControl fullWidth variant="standard">
                <InputLabel
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["apisOption"] &&
                    Boolean(formik.errors["apisOption"])
                  }
                  helperText={
                    formik.touched["apisOption"] && formik.errors["apisOption"]
                  }
                  id="demo-simple-select-label"
                >
                  {t("Select API")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="standard"
                  name="apisOption"
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["apisOption"] &&
                    Boolean(formik.errors["apisOption"])
                  }
                  helperText={
                    formik.touched["apisOption"] && formik.errors["apisOption"]
                  }
                  value={formik.values.apisOption}
                  onChange={(e) => {
                    formik.handleChange(e);
                    const filteredData = props?.Data.filter(
                      (item) => item?.recordGuid === e?.target?.value
                    );
                    setState((prevState) => ({
                      ...prevState,
                      apiTypeTag: filteredData[0]?.typeTag,
                    }));
                    updateTextFieldAPIValue(
                      filteredData[0]?.typeTag,
                      e?.target?.value
                    );
                    formik.setFieldValue("senderOption", "");
                    formik.setFieldValue("phoneNumber", "");
                    formik.setFieldValue("phoneNumbers", [
                      {
                        number: "",
                      },
                    ]);
                    formik.setFieldValue("sampleText", "");
                    formik.setFieldValue("sampleCode", "");
                    formik.setFieldValue("canCopy", false);
                  }}
                >
                  {state?.apisOptions?.map((api) => (
                    <MenuItem value={api?.value}>{api?.name}</MenuItem>
                  ))}
                </Select>
                {formik.touched.apisOption && formik.errors.apisOption && (
                  <FormHelperText style={{ color: "red" }}>
                    {formik.errors.apisOption}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <p>
                API Id: <b>{formik.values.apisOption}</b>
              </p>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <p>
                Tenant Id: <b>{import.meta.env.VITE_TENANT}</b>
              </p>
            </Grid>
            {props?.service.tag == "TWO_WAY_SMS" && (
              <Grid item xs={3}>
                <FormControl fullWidth variant="standard">
                  <InputLabel
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["smsSendTypeOptions"] &&
                      Boolean(formik.errors["smsSendTypeOptions"])
                    }
                    helperText={
                      formik.touched["smsSendTypeOptions"] &&
                      formik.errors["smsSendTypeOptions"]
                    }
                    id="demo-simple-select-label"
                  >
                    {t("Sender Type")}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant="standard"
                    name="smsSendTypeOptions"
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["smsSendTypeOptions"] &&
                      Boolean(formik.errors["smsSendTypeOptions"])
                    }
                    helperText={
                      formik.touched["smsSendTypeOptions"] &&
                      formik.errors["smsSendTypeOptions"]
                    }
                    onChange={async (e) => {
                      formik.handleChange(e);
                      getSenders({
                        service: props?.service.tag,
                        type: e?.target?.value,
                      });
                    }}
                    value={formik.values.smsSendTypeOptions}
                  >
                    {smsSendTypeOptions?.map((api) => (
                      <MenuItem value={api?.value}>{api?.label}</MenuItem>
                    ))}
                  </Select>
                  {formik.touched.smsSendTypeOptions &&
                    formik.errors.smsSendTypeOptions && (
                      <FormHelperText style={{ color: "#d32f2f" }}>
                        {formik.errors.smsSendTypeOptions}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
            )}
            <Grid
              item
              xs={
                props?.service.tag == "TWO_WAY_SMS"
                  ? 3
                  : state?.apiTypeTag == "GET" ||
                    state?.apiTypeTag == "" ||
                    state?.apiTypeTag == undefined
                  ? 6
                  : 12
              }
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <FormControl fullWidth variant="standard">
                <InputLabel
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["senderOption"] &&
                    Boolean(formik.errors["senderOption"])
                  }
                  helperText={
                    formik.touched["senderOption"] &&
                    formik.errors["senderOption"]
                  }
                  id="demo-simple-select-label"
                >
                  {t("Select Sender")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="standard"
                  name="senderOption"
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["senderOption"] &&
                    Boolean(formik.errors["senderOption"])
                  }
                  helperText={
                    formik.touched["senderOption"] &&
                    formik.errors["senderOption"]
                  }
                  onChange={(e) => {
                    formik.handleChange(e);
                    updateTextFieldSenderValue(e?.target?.value);
                  }}
                  value={formik.values.senderOption}
                >
                  {state?.senderOptions?.map((api) => (
                    <MenuItem value={api?.name}>{api?.name}</MenuItem>
                  ))}
                </Select>
                {formik.touched.senderOption && formik.errors.senderOption && (
                  <FormHelperText style={{ color: "#d32f2f" }}>
                    {formik.errors.senderOption}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {state?.apiTypeTag == "GET" ||
            state?.apiTypeTag == "" ||
            state?.apiTypeTag == undefined ? (
              <Grid
                item
                xs={6}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <TextField
                  variant="standard"
                  fullWidth
                  label={t("Phone Number")}
                  name="phoneNumber"
                  value={formik?.values?.phoneNumber}
                  onChange={(e) => {
                    formik.handleChange(e);
                    updateTextFieldNumberValue(e?.target?.value);
                  }}
                  onBlur={formik?.handleBlur}
                  error={
                    formik.touched["phoneNumber"] &&
                    Boolean(formik.errors["phoneNumber"])
                  }
                  helperText={
                    formik.touched["phoneNumber"] &&
                    formik.errors["phoneNumber"]
                  }
                  maxLength={50}
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <div className="pt-5">
                  <b>{t("Phone Numbers")}</b>
                  {formik.values.phoneNumbers?.map(
                    ({ number }, index, array) => (
                      <Grid container spacing={2} height={"100%"}>
                        <Grid
                          item
                          xs={9}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <TextField
                            variant="standard"
                            fullWidth
                            onChange={(e) => {
                              array[index].number = e.target.value;
                              formik.setFieldValue("phoneNumbers", array);
                            }}
                            value={number}
                            id={`phoneNumbers[${index}].number`}
                            name={`phoneNumbers[${index}].number`}
                            label={`Phone Number ${index + 1}`}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.phoneNumbers &&
                              formik.errors.phoneNumbers &&
                              !!formik.errors.phoneNumbers[index]?.number
                            }
                            helperText={
                              formik.touched.phoneNumbers &&
                              formik.errors.phoneNumbers &&
                              formik.errors.phoneNumbers[index]?.number
                            }
                            maxLength={50}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <button
                            className="minus-alone-btn"
                            onClick={(e) => removePhoneNumber(e, index)}
                          >
                            <RemoveCircleOutlineIcon />
                          </button>
                          <button
                            className="minus-alone-btn"
                            onClick={(e) => addPhoneNumber(e)}
                          >
                            <AddCircleOutlineIcon />
                          </button>
                        </Grid>
                      </Grid>
                    )
                  )}
                </div>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CursorBody
                UpdateText={(data) => {
                  formik.setFieldValue("canCopy", true);
                  formik.setFieldValue("sampleText", data);
                }}
                formik={formik}
                updateTextFieldSampleTextValue={updateTextFieldSampleTextValue}
                data={formik.values.sampleText}
              />
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                variant="standard"
                fullWidth
                multiline
                rows={3}
                disabled
                label={t("Sample Code")}
                value={state?.sampleCode}
                name="sampleCode"
                type={"text"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                fullWidth
                label={t("Api token")}
                name="token"
                value={formik?.values?.token}
                onChange={formik.handleChange}
                onBlur={formik?.handleBlur}
                error={
                  formik.touched["token"] && Boolean(formik.errors["token"])
                }
                helperText={formik.touched["token"] && formik.errors["token"]}
              />
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              {formik.values.canCopy && (
                <Button
                  variant="contained"
                  className={`mui-btn secondary filled`}
                  onClick={() => copyToClipboard(state?.sampleCode)}
                >
                  Copy Code
                </Button>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              <p>
                You can also copy the sample code into your application, enter
                the required details, press generate code and test directly from
                your application.
              </p>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Button
                variant="contained"
                className="mui-btn secondary filled"
                type="submit"
              >
                {"Test Integration"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  token: state.authentication ? state.authentication.token : "",
});

export default connect(
  mapStateToProps,
  null
)(withTranslation("translations")(TestIntegratedAPI));
