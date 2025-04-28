import * as Yup from "yup";

const addValidationSchema = Yup.object().shape({
  providerCategory: Yup.object().required("Provider Category is required"),
  provider: Yup.object().required("Provider is required"),
  country: Yup.object().required("Country is required"),
  currency: Yup.string().required("Currency is required"),
  cost: Yup.string()
    .required("Cost is required")
    .test("is-valid-number", "Cost must be a valid number", (value) => {
      if (!value) return false;

      // Check if the value is a valid number
      return !isNaN(value);
    })
    .test("max-digits", "Cost must have a maximum of 15 digits", (value) => {
      if (!value) return true;

      // Remove the decimal point and count total digits
      const cleanValue = value.replace(".", "");

      // Check if total digits (integer + decimal) is at most 15
      return cleanValue.length <= 15;
    }),
});

export default addValidationSchema;
