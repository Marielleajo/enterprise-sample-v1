import * as Yup from "yup";

export const addLookupConfigurationHTTPValidationSchema = Yup.object().shape({
  connectivityType: Yup.string().required("Connectivity Type is required"),
  numberofThreads: Yup.number()
    .typeError("Must be a number!")
    .required("Number of threads is required")
    .min(0, "Number of threads must be at least 0")
    .max(10, "Number of threads must be at most 10")
    .test(
      "is-decimal",
      "Must be a valid number between 0 and 10",
      (value) =>
        value !== undefined && /^[0-9]*\.?[0-9]+$/.test(value.toString())
    ),
  classLocation: Yup.string().required("Class Location is required"),
  host: Yup.string().when("connectivityType", {
    is: (val) => val == "HTTP" || val == "ENUM", // alternatively: (val) => val == true
    then: (schema) => schema.required("Host is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

export const addLookupConfigurationENUMValidationSchema = Yup.object().shape({
  connectivityType: Yup.string().required("Connectivity Type is required"),
  numberofThreads: Yup.number()
    .typeError("Must be a number!")
    .required("Number of threads is required")
    .min(0, "Number of threads must be at least 0")
    .max(10, "Number of threads must be at most 10")
    .test(
      "is-decimal",
      "Must be a valid number between 0 and 10",
      (value) =>
        value !== undefined && /^[0-9]*\.?[0-9]+$/.test(value.toString())
    ),
  classLocation: Yup.string().required("Class Location is required"),
  host: Yup.string().when("connectivityType", {
    is: (val) => val == "HTTP" || val == "ENUM", // alternatively: (val) => val == true
    then: (schema) => schema.required("Host is required"),
    otherwise: (schema) => schema.optional(),
  }),
  port: Yup.string().when("connectivityType", {
    is: (val) => val == "ENUM", // alternatively: (val) => val == true
    then: (schema) =>
      schema
        .typeError("Must be a number!")
        .required("Port is required")
        .min(0, "Number of threads must be at least 0")
        .max(10, "Number of threads must be at most 10"),
    otherwise: (schema) => schema.optional(),
  }),
});