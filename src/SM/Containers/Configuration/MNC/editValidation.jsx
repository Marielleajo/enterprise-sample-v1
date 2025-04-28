import * as Yup from "yup";

const editValidationSchema = Yup.object().shape({
  MNCNumber: Yup.number()
    .required("MNC number is required")
    .positive("MNC number must be a positive number")
    .typeError("MNC number must be a number"),
  MCCNumber: Yup.number()
    .required("MCC number is required")
    .positive("MCC number must be a positive number")
    .typeError("MCC number must be a number"),
});

export default editValidationSchema;
