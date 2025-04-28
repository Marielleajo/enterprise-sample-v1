import * as Yup from "yup";

const validationSchemaTestWhatsapp = [
  Yup.object().shape({
    SelectedWhatsappApi: Yup.string().required("Apis is required"),
    SelectedWhatsappTemplate: Yup.string().required("Template is required"),
    // source: Yup.string().required("Source is required"),
    destination: Yup.string().required("Destination is required"),
  }),
  Yup.object().shape({
    // whatsappQuery: Yup.string().required("Whatsapp query is required"),
    token: Yup.string().required("Api token is required"),
  }),
];

export default validationSchemaTestWhatsapp;
