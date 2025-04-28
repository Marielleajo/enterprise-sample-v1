import * as Yup from "yup";

const addValidationSchema = Yup.object().shape({
  prefixNumber: Yup.number()
    .required("Prefix number is required")
    .positive("Prefix number must be a positive number")
    .typeError("Prefix number must be a number"),
  country: Yup.string().required("Country is required"),
});

export default addValidationSchema;
