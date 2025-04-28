import * as Yup from "yup";

const addValidationSchema = Yup.object().shape({
  clientCategory: Yup.string().required("Client Category is required"),
  country: Yup.string().required("Country is required"), // Changed to string for consistency
  currency: Yup.string().required("Currency is required"),
  rate: Yup.number()
    .required('Rate is required')
    .typeError('Rate must be a number'),
});

export default addValidationSchema;
