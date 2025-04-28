import * as Yup from "yup";

const addValidationWhatsappSchema = Yup.object().shape({
  clientCategory: Yup.object().required("Client Category is required"),
  country: Yup.object().required("Country is required"),
  currency: Yup.string().required("Currency is required"),
  operationType: Yup.string().required("Operation Type is required"),
  rate: Yup.string()
    .required("Rate is required")
    .test("is-valid-number", "Rate must be a valid number", (value) => {
      if (!value) return false;

      // Check if the value is a valid number
      return !isNaN(value);
    })
    .test("max-digits", "Rate must have a maximum of 15 digits", (value) => {
      if (!value) return true;

      const cleanValue = value.replace(".", ""); // Remove the decimal point

      // Check if the total number of digits is at most 15
      return cleanValue.length <= 15;
    }),
});

export default addValidationWhatsappSchema;
