import * as Yup from "yup";

export const validationSchema = [
  Yup?.object()?.shape({
    tokenName: Yup?.string().required("Token Name is Required"),
    expiryDate: Yup.date()
      .typeError("Expiration Date must be a valid date")
      .required("Expiration Date is Required"),
    selectedScopes: Yup.array().min(1, "At least one scope must be selected"),
  }),
];
