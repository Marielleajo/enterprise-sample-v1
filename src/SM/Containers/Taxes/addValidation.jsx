import * as Yup from "yup";

const fromDateValidator = Yup.date()
  .min(new Date(), "From Date must be today or later")
  .required("From Date is required");

const toDateValidator = Yup.date()
  .min(Yup.ref("fromDate"), "To Date must be later than From Date")
  .required("To Date is required");

const addValidation = Yup.object().shape({
  taxRate: Yup.number()
    .required("Tax Rate is required")
    .typeError("Tax Rate must be a number"),
  country: Yup.object().required("Country is required"),
  taxType: Yup.string().required("Tax Type is required"),
  taxCategory: Yup.string().required("Tax Category is required"),
  fromDate: fromDateValidator,
  toDate: toDateValidator,
  name: Yup.string().required("Name is required"),
  // description: Yup.string().required("Description is required"),
});

export default addValidation;
