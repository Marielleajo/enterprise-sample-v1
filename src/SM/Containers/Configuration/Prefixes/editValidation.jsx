import * as Yup from "yup";

const editValidationSchema = Yup.object().shape({
  prefixNumber: Yup.number()
    .required("Prefix number is required")
    .positive("Prefix number must be a positive number")
    .typeError("Prefix number must be a number"),
});

export default editValidationSchema;
