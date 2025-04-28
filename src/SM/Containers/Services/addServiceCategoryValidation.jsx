import * as Yup from "yup";

export const addServiceCategoryValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});
