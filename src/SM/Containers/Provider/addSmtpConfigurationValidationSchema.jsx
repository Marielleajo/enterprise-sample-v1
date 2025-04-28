import * as Yup from "yup";

const addSmtpConfigurationValidationSchema = Yup.object().shape({
  smtpServer: Yup.string()
    .required("Server is required")
    .test(
      "is-ip",
      "Must be a valid IP address",
      (value) =>
        value &&
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          value
        )
    ),
  smtpUser: Yup.string().required("Username is required"),
  smtpPassword: Yup.string().required("Password is required"),
  smtpPort: Yup.string()
    .typeError("Must be a number!")
    .required("Port is required")
    .min(0, "Number of threads must be at least 0")
    .max(10, "Number of threads must be at most 10"),
  fromAddress: Yup.string().required("From Address is required"),
  replyAddress: Yup.string().required("From Address is required"),
});

export default addSmtpConfigurationValidationSchema;
