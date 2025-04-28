import * as Yup from "yup";

const AddEditValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required")
});

export default AddEditValidationSchema;
