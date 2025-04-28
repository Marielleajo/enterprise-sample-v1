import * as Yup from "yup";

const validationSchema = [
  Yup.object().shape({
    // name: Yup.string().required("name is required"),
    clientName: Yup.string().required("Client name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("email is required"),
    // username: Yup.string().required("username is required"),
    // Info: Yup.object().shape({
    //   IndustryTag: Yup.string().required("Industry is required"),
    // }),
    password: Yup.string()
      .required("Password is required")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&?*]/, "Password must contain at least one symbol")
      .min(12, "Password must be at least 12 characters long")
      .matches(/[0-9]/, "Password must contain at least one number"),
    // businesswebsite: Yup.string().required("Business website is required"),
    phone: Yup.string().required("Phone is required"),
    // category: Yup.string().required("Category is required"),
    // account_manager: Yup.string().required("Account manager is required"),
    country: Yup.object().required("Country is required"),
    // region: Yup.string().required("Region is required"),
    // city: Yup.string().required("City is required"),
    // street: Yup.string().required("Street is required"),
    // building: Yup.string().required("Building is required"),
    // floor: Yup.string().required("Floor is required"),
    // address1: Yup.string().required("Address 1 is required"),
  }),
  Yup.object().shape({
    // BillingEmail: Yup.string().required("Billing Email is required"),
    // TechnicalEmail: Yup.string().required("Technical Email is required"),
    // AlertsEmail: Yup.string().required("Alerts Email is required"),
    // BusinessWebUrl: Yup.string().required("Business Web URL is required"),
  }),
];

export default validationSchema;
