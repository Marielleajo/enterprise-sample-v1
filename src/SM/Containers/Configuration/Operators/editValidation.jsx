import * as Yup from "yup";

const editValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required")
});

export default editValidationSchema;
