import * as Yup from "yup";

export const validationSchemaGET = [
  Yup?.object()?.shape({
    apisOption: Yup.string().required("api is required"),
    senderOption: Yup.string().required("Sender is required"),
    phoneNumber: Yup.number().required("Phone Number is required"),
    sampleText: Yup.string().required("Sample Text is required"),
    token: Yup.string().required("Api token is required"),
    smsSendTypeOptions: Yup.string().when("service", {
      is: (val) => val == "TWO_WAY_SMS", // alternatively: (val) => val == true
      then: (schema) => schema.required("Sender type is required"),
      otherwise: (schema) => schema.optional(),
    })
  }),
];

export const validationSchemaPOST = [
  Yup?.object()?.shape({
    apisOption: Yup.string().required("api is required"),
    senderOption: Yup.string().required("Sender is required"),
    phoneNumbers: Yup.array().of(
      Yup.object().shape({
        number: Yup.number().required("Phone Number is required"),
      })
    ),
    sampleText: Yup.string().required("Sample Text is required"),
    token: Yup.string().required("Api token is required")
  }),
];
