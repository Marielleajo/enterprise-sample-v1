import * as Yup from "yup";

const editValidationSchema = Yup.object().shape({
  provider: Yup.object().required("Provider is required")
});

export default editValidationSchema;
