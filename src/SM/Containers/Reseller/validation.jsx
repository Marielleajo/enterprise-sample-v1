import * as Yup from "yup";

export const postpaidValidationSchema = [
  Yup.object().shape({
    firstName: Yup.string()
      .matches(
        /^[A-Za-z]+(\s[A-Za-z]+)*$/,
        "Name can only contain letters and spaces, and cannot start or end with a space"
      )
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("email is required"),
    username: Yup.string().required("username is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&?*]/, "Password must contain at least one symbol")
      .min(12, "Password must be at least 12 characters long")
      .matches(/[0-9]/, "Password must contain at least one number"),
    accountType: Yup.string().required("Account type is required"),
    businesswebsite: Yup.string().required("Business website is required"),
    phone: Yup.string().required("Phone is required"),
    category: Yup.string().required("Category is required"),
    country: Yup.string().required("Country is required"),
    address1: Yup.string().required("Main address is required"),
    zip: Yup.string().required("Zip is required"),
  }),
  Yup.object().shape({
    accountTypeRecordGuid: Yup.string().required("Account type is required"),
    balanceLimit: Yup.number().when("accountTypeRecordGuid", {
      is: (val) => val === "Postpaid",
      then: (schema) =>
        schema
          .required("Balance Limit is required")
          .typeError("Balance Limit must be a number"),
      otherwise: (schema) => schema.optional(),
    }),
    thresholdLimit: Yup.number()
      .min(1, "Threshold Limit must be at least 1")
      .max(100, "Threshold Limit must be at most 100")
      .typeError("Threshold Limit must be a number")
      .when("accountTypeRecordGuid", {
        is: (val) => val === "Postpaid",
        then: (schema) => schema.required("Threshold Limit is required"),
        otherwise: (schema) => schema.optional(),
      }),
  }),
  Yup.object().shape({
    Alerts: Yup.boolean(),
    fromAddress: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("From Address is required"),
      otherwise: (schema) => schema.optional(),
    }),
    ReplyAddress: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("From Address is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpServer: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP Server is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpUser: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP User is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpPassword: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP Password is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpPort: Yup.number().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP Port is required"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
  Yup.object().shape({
    ALERTS_TOGGLE: Yup.boolean(),
    ALERTS: Yup.string()
      .email("Invalid email address")
      .when("ALERTS_TOGGLE", {
        is: (val) => val === true,
        then: (schema) => schema.required("Email Address is required"),
        otherwise: (schema) => schema.optional(),
      }),
    SENDER_TOGGLE: Yup.boolean(),
    SENDER: Yup.string().when("SENDER_TOGGLE", {
      is: (val) => val === true,
      then: (schema) => schema.required("Sender is required"),
      otherwise: (schema) => schema.optional(),
    }),
    API_TOGGLE: Yup.boolean(),
    API: Yup.string().when("API_TOGGLE", {
      is: (val) => val === true,
      then: (schema) => schema.required("Default API is required"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
  Yup.object()
    .shape({
      COPYRIGHTS_TOGGLE: Yup.boolean(),
      COPYRIGHTS: Yup.string().when("COPYRIGHTS_TOGGLE", {
        is: (val) => val === true,
        then: (schema) => schema.required("Copyrights is required"),
        otherwise: (schema) => schema.optional(),
      }),
      DEFAULT_SIGNIN: Yup.boolean(),
      GOOGLE: Yup.boolean(),
      GITHUB: Yup.boolean(),
    })
    .test("signinValidation", "Please choose one sign in method", (obj) => {
      if (obj.DEFAULT_SIGNIN || obj.GOOGLE || obj.GITHUB) {
        return true; // everything is fine
      }

      return new Yup.ValidationError(
        "Please choose one sign in method",
        null,
        "signinValidation"
      );
    }),
  Yup.object().shape({
    BusinessWebUrl: Yup.string()
      .required("Domain name is required")
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\.([a-zA-Z]{2,})(?:\/\S*)?$/,
        "Invalid domain name"
      ),
    PORTAL_NAME: Yup.string().required("Portal name is required"),
  }),
  Yup.object().shape({
    BillingEmail: Yup.string()
      .email("Invalid email address")
      .required("Billing Email is required"),
    TechnicalEmail: Yup.string()
      .email("Invalid email address")
      .required("Technical Email is required"),
    AlertsEmail: Yup.string()
      .email("Invalid email address")
      .required("Alerts Email is required"),
  }),
];

export const prepaidValidationSchema = [
  Yup.object().shape({
    firstName: Yup.string()
      .matches(
        /^[A-Za-z]+(\s[A-Za-z]+)*$/,
        "Name can only contain letters and spaces, and cannot start or end with a space"
      )
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("email is required"),
    username: Yup.string().required("username is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&?*]/, "Password must contain at least one symbol")
      .min(12, "Password must be at least 12 characters long")
      .matches(/[0-9]/, "Password must contain at least one number"),
    accountType: Yup.string().required("Account type is required"),
    businesswebsite: Yup.string().required("Business website is required"),
    phone: Yup.string().required("Phone is required"),
    category: Yup.string().required("Category is required"),
    country: Yup.string().required("Country is required"),
    address1: Yup.string().required("Main address is required"),
    zip: Yup.string().required("Zip is required"),
  }),
  Yup.object().shape({
    Alerts: Yup.boolean(),
    fromAddress: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("From Address is required"),
      otherwise: (schema) => schema.optional(),
    }),
    ReplyAddress: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("From Address is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpServer: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP Server is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpUser: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP User is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpPassword: Yup.string().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP Password is required"),
      otherwise: (schema) => schema.optional(),
    }),
    SmtpPort: Yup.number().when("Alerts", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("SMTP Port is required"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
  Yup.object().shape({
    ALERTS_TOGGLE: Yup.boolean(),
    ALERTS: Yup.string()
      .email("Invalid email address")
      .when("ALERTS_TOGGLE", {
        is: (val) => val === true,
        then: (schema) => schema.required("Email Address is required"),
        otherwise: (schema) => schema.optional(),
      }),
    SENDER_TOGGLE: Yup.boolean(),
    SENDER: Yup.string().when("SENDER_TOGGLE", {
      is: (val) => val === true,
      then: (schema) => schema.required("Sender is required"),
      otherwise: (schema) => schema.optional(),
    }),
    API_TOGGLE: Yup.boolean(),
    API: Yup.string().when("API_TOGGLE", {
      is: (val) => val === true,
      then: (schema) => schema.required("Default API is required"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
  Yup.object()
    .shape({
      COPYRIGHTS_TOGGLE: Yup.boolean(),
      COPYRIGHTS: Yup.string().when("COPYRIGHTS_TOGGLE", {
        is: (val) => val === true,
        then: (schema) => schema.required("Copyrights is required"),
        otherwise: (schema) => schema.optional(),
      }),
      DEFAULT_SIGNIN: Yup.boolean(),
      GOOGLE: Yup.boolean(),
      GITHUB: Yup.boolean(),
    })
    .test("signinValidation", "Please choose one sign in method", (obj) => {
      if (obj.DEFAULT_SIGNIN || obj.GOOGLE || obj.GITHUB) {
        return true; // everything is fine
      }

      return new Yup.ValidationError(
        "Please choose one sign in method",
        null,
        "signinValidation"
      );
    }),
  Yup.object().shape({
    BusinessWebUrl: Yup.string()
      .required("Domain name is required")
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\.([a-zA-Z]{2,})(?:\/\S*)?$/,
        "Invalid domain name"
      ),
    PORTAL_NAME: Yup.string().required("Portal name is required"),
  }),
  Yup.object().shape({
    BillingEmail: Yup.string()
      .email("Invalid email address")
      .required("Billing Email is required"),
    TechnicalEmail: Yup.string()
      .email("Invalid email address")
      .required("Technical Email is required"),
    AlertsEmail: Yup.string()
      .email("Invalid email address")
      .required("Alerts Email is required"),
  }),
];
