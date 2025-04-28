import * as Yup from "yup";

const validationSchema = [
  Yup.object().shape({
    businessName: Yup.string().required("Client name is required"),
    country: Yup.object().required("Country is required"),
  }),
  Yup.object().shape({
    // BillingEmail: Yup.string().required("Billing Email is required"),
    // TechnicalEmail: Yup.string().required("Technical Email is required"),
    // AlertsEmail: Yup.string().required("Alerts Email is required"),
    // BusinessWebUrl: Yup.string().required("Business Web URL is required"),
  }),
];

export default validationSchema;
