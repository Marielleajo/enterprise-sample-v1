import * as Yup from "yup";

export const addDistrictValidationSchema = Yup.object().shape({
  Name: Yup.string().trim().required("Name is required"),
  country: Yup.object().required("Country is required"),
  // parentGuid: Yup.string().required("State is required"),
});

export const editDistrictValidationSchema = Yup.object().shape({
  Name: Yup.string().trim().required("Name is required"),
});
