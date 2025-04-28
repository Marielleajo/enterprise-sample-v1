import * as Yup from "yup";

const addValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  country: Yup.object().required("Country is required"),
  mcc: Yup.number()
    .required("MCC is required")
    .positive("MCC must be a positive number")
    .typeError("MCC must be a number"),
  mnc: Yup.number()
    .required("MNC is required")
    .typeError("MNC must be a number"),
});

export default addValidationSchema;
