import * as Yup from "yup";

const editValidationSchema = [
  Yup.object().shape({
    businessName: Yup.string().required("Business Name is required"),
    firstName: Yup.string().required("First Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("email is required"),
  }),
  Yup.object().shape({
    address: Yup.string().required("Address is required"),
    country: Yup.object().required("Country is required"),
    floor: Yup.number().typeError("Floor must be a number!"),
  }),
  Yup.object().shape({
    engagementEmail: Yup.string().email("Invalid email address"),
    supportEmail: Yup.string().email("Invalid email address"),
    billingEmail: Yup.string().email("Invalid email address"),
    technicalEmail: Yup.string().email("Invalid email address"),
    alertEmail: Yup.string().email("Invalid email address"),
    businessWebURL: Yup.string()
      .required("Domain name is required")
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\.([a-zA-Z]{2,})(?:\/\S*)?$/,
        "Invalid domain name"
      ),
  }),
];

export default editValidationSchema;
