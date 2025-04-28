import * as Yup from "yup";

const addValidationSchema = [
  Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    serviceCategory: Yup.string().required("Service Category is required"),
    serviceType: Yup.string().required("Service Type is required"),
    currency: Yup.string().required("Currency Type is required"),
    // pricingType: Yup.string().required("Pricing Type is required"),
    defaultCost: Yup.number().when("pricingType", {
      is: (val) => val !== "TRAFFIC", // alternatively: (val) => val == true
      then: (schema) =>
        schema
          .required("Default Cost is required")
          .typeError("Default Cost must be a number")
          .positive("Default Cost must be a positive number"),
      otherwise: (schema) => schema.optional(),
    }),
    defaultSell: Yup.number().when("pricingType", {
      is: (val) => val !== "TRAFFIC", // alternatively: (val) => val == true
      then: (schema) =>
        schema
          .required("Default Sell is required")
          .typeError("Default Sell must be a number")
          .positive("Default Sell must be a positive number"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
];

export default addValidationSchema;
