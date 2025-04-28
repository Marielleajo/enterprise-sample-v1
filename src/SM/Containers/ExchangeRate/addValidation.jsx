import * as Yup from "yup";

const addValidationSchema = Yup.object().shape({
  currency: Yup.string()
    .required("Currency is required"),
  currentRate: Yup.number()
    .required("Current Rate is required")
    .typeError("Current Rate must be a number")
    .positive("Current Rate must be a positive number"),
  currentRateInverse: Yup.number()
    .required("Rate Inverse is required")
    .typeError("Rate Inverse must be a number")
    .positive("Rate Inverse must be a positive number"),
});

export default addValidationSchema;
