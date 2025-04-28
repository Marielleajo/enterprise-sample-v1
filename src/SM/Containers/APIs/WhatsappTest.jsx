import {
  Autocomplete,
  Box,
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
import {
  GET_ALL_WHATSAPP_TEMPLATES,
  SEND_WHATSAPP_API,
  SEND_WHATSAPP_API_TOKEN,
} from "../../../APIs/Whatsapp";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import { GET_ALL_SENDERS, GET_SENDER_BY_GUID } from "../../../APIs/Sender";
import ViewTemplateWhatsapp from "../../SingleMessage/Simulate/ViewTemplateWhatsapp";
import StepperComponent from "../../../../Components/Stepper/StepperComponent";
import * as Yup from "yup";
import validationSchemaTestWhatsapp from "./validation";

const WhatsappTest = ({ apis, open, handleClose }) => {
  const [activeStep, SetActiveStep] = useState(0);
  const [whatsappTemplates, SetWhatsappTemplates] = useState([]);
  const [Template, SetTemplate] = useState(null);
  const [senderIdOption, setSenderIdOptions] = useState([]);

  const { showSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      SelectedWhatsappApi: "",
      SelectedWhatsappTemplate: "",
      source: "",
      destination: "",
      whatsappQuery: "",
      token: "",
    },
    validationSchema: validationSchemaTestWhatsapp[activeStep],
    onSubmit: async (values) => {
      if (activeStep == 2) {
        try {
          let response = await SEND_WHATSAPP_API_TOKEN({
            ApiId: values["SelectedWhatsappApi"],
            Source: values["source"],
            Destination: values["destination"],
            query: values["whatsappQuery"],
            token: values["token"],
          });
          showSnackbar(response?.data?.message || "Successfully Tested API");
          // getAPIs({});
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          handleClose();
        }
      } else {
        SetActiveStep((prev) => prev + 1);
      }
    },
  });
  const getAllTemplates = async ({ search = true }) => {
    try {
      let templateResponse = await GET_ALL_WHATSAPP_TEMPLATES({
        pageSize: 1000,
        page: 1,
        search: null,
        status: "APPROVED",
      });
      SetWhatsappTemplates(templateResponse?.data?.data?.whatsappTemplates);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  const setSenderName = async (senderId) => {
    try {
      let response = await GET_SENDER_BY_GUID({ recordGuid: senderId });
      formik?.setFieldValue("source", response?.data?.data?.sender?.name);
    } catch (e) {
      console.log(e);
    }
  };

  const GetSenderIds = async ({ search, service, senderType = null }) => {
    setSenderIdOptions([]);
    try {
      let response = await GET_ALL_SENDERS({
        isAdmin: false,
        status: "APPROVED",
        pageSize: 1000,
        search: search ?? "",
        ServiceTag: service,
        TypeTag: senderType ?? "",
      });
      setSenderIdOptions(
        response?.data?.data?.senders?.map((item) => {
          return { id: item?.recordGuid, name: item?.name };
        })
      );
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  useEffect(() => {
    getAllTemplates({});
    GetSenderIds({ service: "WHATSAPP" });
  }, []);
  const theme = useTheme();

  return (
    <MuiModal
      width={600}
      open={open}
      style={
        activeStep == 1 ? { height: "70vh", overflow: "hidden scroll" } : {}
      }
      handleClose={handleClose}
      title="Test Whatsapp Api"
    >
      <StepperComponent
        steps={["Select Api", "Select Template", "Test"]}
        activeStep={activeStep}
      />
      <Box paddingX={4}>
        {activeStep == 0 && (
          <Grid container rowSpacing={2.5}>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <InputLabel
                  error={
                    formik.touched["SelectedWhatsappApi"] &&
                    Boolean(formik.errors["SelectedWhatsappApi"])
                  }
                  helperText={
                    formik.touched["SelectedWhatsappApi"] &&
                    formik.errors["SelectedWhatsappApi"]
                  }
                >
                  Select Whatsapp Api
                </InputLabel>
                <Select
                  value={formik?.values?.SelectedWhatsappApi}
                  onChange={(e) => {
                    formik?.handleChange(e);
                  }}
                  onBlur={formik?.handleBlur}
                  name="SelectedWhatsappApi"
                >
                  {apis
                    ?.filter((item) => item?.isRegistered == true)
                    ?.map((item) => (
                      <MenuItem value={item?.recordGuid}>{item?.name}</MenuItem>
                    ))}
                </Select>
                {formik.touched.SelectedWhatsappApi &&
                  formik.errors.SelectedWhatsappApi && (
                    <FormHelperText
                      style={{ color: theme?.palette?.error?.main }}
                    >
                      {formik.errors.SelectedWhatsappApi}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <InputLabel
                  error={
                    formik.touched["SelectedWhatsappTemplate"] &&
                    Boolean(formik.errors["SelectedWhatsappTemplate"])
                  }
                >
                  Select Whatsapp Template
                </InputLabel>
                <Select
                  error={
                    formik.touched["SelectedWhatsappTemplate"] &&
                    Boolean(formik.errors["SelectedWhatsappTemplate"])
                  }
                  value={formik?.values?.SelectedWhatsappTemplate}
                  onChange={(e) => {
                    formik?.handleChange(e);
                    SetTemplate(
                      whatsappTemplates?.find(
                        (item) => item?.recordGuid == e?.target?.value
                      )
                    );
                  }}
                  onBlur={formik?.handleBlur}
                  name="SelectedWhatsappTemplate"
                >
                  {whatsappTemplates?.map((item) => (
                    <MenuItem value={item?.recordGuid}>{item?.name}</MenuItem>
                  ))}
                </Select>
                {formik.touched.SelectedWhatsappTemplate &&
                  formik.errors.SelectedWhatsappTemplate && (
                    <FormHelperText
                      style={{ color: theme?.palette?.error?.main }}
                    >
                      {formik.errors.SelectedWhatsappTemplate}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <Autocomplete
                options={senderIdOption}
                clearIcon={false}
                getOptionLabel={(option) => option.name}
                value={
                  senderIdOption?.find(
                    (item) => item?.name == formik?.values?.source
                  ) || null
                }
                onChange={(event, option) => {
                  const {
                    target: { value },
                  } = event;
                  formik?.setFieldValue("source", option?.name);
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option?.name}</li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Sender Id"
                    placeholder="Sender Id"
                    error={
                      formik.touched["source"] &&
                      Boolean(formik.errors["source"])
                    }
                    helperText={
                      formik.touched["source"] && formik.errors["source"]
                    }
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="standard"
                label="Destination"
                name="destination"
                value={formik?.values?.destination}
                placeholder="Destination"
                onChange={formik.handleChange}
                onBlur={formik?.handleBlur}
                error={
                  formik.touched["destination"] &&
                  Boolean(formik.errors["destination"])
                }
                helperText={
                  formik.touched["destination"] && formik.errors["destination"]
                }
              />
            </Grid>
          </Grid>
        )}

        {activeStep == 1 && (
          <ViewTemplateWhatsapp
            type="api"
            Template={Template}
            handleClose={() => {
              SetTemplate(null);
            }}
            goBack={() => SetActiveStep((prev) => prev - 1)}
            handleSaveData={(data) => {
              SetActiveStep((prev) => prev + 1);
              formik?.setFieldValue(
                "whatsappQuery",
                Object.entries(data)
                  .filter(([_, value]) => value !== null && value !== undefined)
                  .map(
                    ([key, value]) =>
                      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                  )
                  .join("&")
              );
            }}
            setSenderName={setSenderName}
          />
        )}

        {activeStep == 2 && (
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="standard"
                name="token"
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                label="Api token"
                placeholder="Api token"
                error={
                  formik.touched["token"] && Boolean(formik.errors["token"])
                }
                helperText={formik.touched["token"] && formik.errors["token"]}
              />
            </Grid>
          </Grid>
        )}

        {activeStep != 1 && (
          <Box display={"flex"} marginTop={4} justifyContent={"flex-end"}>
            {activeStep != 0 && (
              <Button
                className="mui-btn grey"
                // style={{ dd }}
                onClick={() => SetActiveStep((prev) => prev - 1)}
              >
                Back
              </Button>
            )}
            <Button
              className="mui-btn primary filled"
              onClick={formik?.handleSubmit}
            >
              {activeStep == 2 ? "Submit" : "Next"}
            </Button>
          </Box>
        )}
      </Box>
    </MuiModal>
  );
};

export default WhatsappTest;
