import * as Yup from "yup";

const addValidationSchema = Yup.object().shape({
  clientCategory: Yup.string().required("Client Category is required"),
  country: Yup.string().required("Country is required"), // Changed to string for consistency
  provider: Yup.object().required("Provider is required"),
  operator: Yup.object().required("Operator is required"),
});

export default addValidationSchema;
