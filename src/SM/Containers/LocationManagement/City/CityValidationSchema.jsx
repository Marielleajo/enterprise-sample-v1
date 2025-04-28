import * as Yup from "yup";

export const addCityValidationSchema = Yup.object().shape({
  Name: Yup.string().trim().required("Name is required"),
  country: Yup.string().required("Country is required"),
});

export const editCityValidationSchema = Yup.object().shape({
  Name: Yup.string().trim().required("Name is required"),
});
