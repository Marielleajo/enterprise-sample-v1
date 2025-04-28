import * as Yup from "yup";

const bankingDetailsValidationSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  iban: Yup.string().required("IBAN is required"),
  codeSwiftBic: Yup.string().required("Code Swift Bic is required"),
  accountNumber: Yup.string().required("Account Number is required"),
  routingNumber: Yup.string().required("Routing Number is required"),
  bankName: Yup.string().required("Bank Name is required"),
  street: Yup.string().required("Street is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  postCode: Yup.string().required("Post Code is required"),
  city: Yup.string().required("City is required"),
  swiftCorrespondent: Yup.string().required("Swift Correspondent is required"),
});

export default bankingDetailsValidationSchema;
