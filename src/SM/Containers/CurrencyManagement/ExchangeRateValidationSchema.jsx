import * as Yup from "yup";

const ExchangeRateValidationSchema = () => {
  let schema;

  schema = Yup.object().shape({
    currency: Yup.string().required("Quote Currency is required"),
    rate: Yup.string().required("Amount is required"),
    defaultCurrency: Yup.string().required("Default Currency is required"),
  });
  return schema;
};

export default ExchangeRateValidationSchema;
