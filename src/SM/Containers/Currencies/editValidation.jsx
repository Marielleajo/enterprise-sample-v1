import * as Yup from 'yup';

const editValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name should be at least 3 characters long'),
  code: Yup.string()
    .required('Code is required')
    .matches(/^[A-Z]{3}$/, 'Code should be exactly 3 uppercase letters'),
  symbol: Yup.string()
    .required('Symbol is required')
    .min(1, 'Symbol should be at least 1 character long'),
  currencyEnum: Yup.string()
    .required('Currency Enum is required')
    // .oneOf(['USD', 'EUR', 'GBP', 'JPY'], 'Invalid Currency Enum'),
});

export default editValidationSchema;
