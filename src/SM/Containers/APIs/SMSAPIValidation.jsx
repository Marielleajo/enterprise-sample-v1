import * as Yup from "yup";

export const validationSchema = [
  Yup?.object()?.shape({
    name: Yup?.string().required("Required"),
  }),
  Yup?.object()?.shape({
    countryCode: Yup.string().when("enableNumberConvertion", {
      is: (val) => val == true, // alternatively: (val) => val == true
      then: (schema) => schema.required("Country is required"),
      otherwise: (schema) => schema.optional(),
    }),
    apiUrl: Yup.string()
      .matches(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/,
        "Invalid URL format"
      )
      .when("isDeliveryApi", {
        is: (val) => val == true, // alternatively: (val) => val == true
        then: (schema) => schema.required("URL is required"),
        otherwise: (schema) => schema.optional(),
      }),
  }),
];
