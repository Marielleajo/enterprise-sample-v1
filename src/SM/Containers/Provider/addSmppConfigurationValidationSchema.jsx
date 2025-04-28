import * as Yup from "yup";

const addSmppConfigurationValidationSchema = Yup.object().shape({
  smppUser: Yup.string().required("Username is required"),
  smppPassword: Yup.string().required("Password is required"),
  ipAddress: Yup.string()
    .required("Ip Address is required")
    .test(
      "is-ip",
      "Must be a valid IP address",
      (value) =>
        value &&
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          value
        )
    ),
  portAddress: Yup.string().required("Port is required"),
  shortCodeTonNpi: Yup.string().required("Short Code TON NPI is required"),
  maximumRetry: Yup.number()
    .typeError("Must be a number!")
    .required("Maximum retry is required")
    .min(0, "Maximum retry must be at least 0")
    .max(10, "Maximum retry must be at most 10")
    .test(
      "is-decimal",
      "Must be a valid number between 0 and 10",
      (value) =>
        value !== undefined && /^[0-9]*\.?[0-9]+$/.test(value.toString())
    ),
  connectionToOpen: Yup.number()
    .typeError("Must be a number!")
    .required("Connection to open is required")
    .min(0, "Connection to open must be at least 0")
    .max(10, "Connection to open must be at most 10")
    .test(
      "is-decimal",
      "Must be a valid number between 0 and 10",
      (value) =>
        value !== undefined && /^[0-9]*\.?[0-9]+$/.test(value.toString())
    ),
  enquireLink: Yup.number()
    .typeError("Must be a number!")
    .required("Enquire link is required")
    .min(0, "Enquire link must be at least 0")
    .max(10, "Enquire link must be at most 10")
    .test(
      "is-decimal",
      "Must be a valid number between 0 and 10",
      (value) =>
        value !== undefined && /^[0-9]*\.?[0-9]+$/.test(value.toString())
    ),
  submitPerSecond: Yup.number()
    .typeError("Must be a number!")
    .required("Submit per second is required")
    .min(0, "Submit per second must be at least 0")
    .max(10, "Submit per second must be at most 10")
    .test(
      "is-decimal",
      "Must be a valid number between 0 and 10",
      (value) =>
        value !== undefined && /^[0-9]*\.?[0-9]+$/.test(value.toString())
    ),
  connectionMode: Yup.string().required("Connection mode is required"),
});

export default addSmppConfigurationValidationSchema;
