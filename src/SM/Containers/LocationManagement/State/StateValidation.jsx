import * as Yup from "yup";

export const addValidationSchema = Yup.object().shape({
  Name: Yup.string().trim().required("Name is required"),

  country: Yup.object().required("Country is required"),
});

export const editValidationSchema = Yup.object().shape({
  Name: Yup.string().trim().required("Name is required"),
});
