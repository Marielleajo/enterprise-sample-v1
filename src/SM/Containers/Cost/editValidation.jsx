import * as Yup from "yup";

const editValidationSchema = Yup.object().shape({
  cost: Yup.string()
    .required("Cost is required")
    .test("is-valid-number", "Cost must be a valid number", (value) => {
      if (!value) return false;

      // Check if the value is a valid number
      return !isNaN(value);
    })
    .test(
      "max-digits",
      "Cost must have a maximum of 15 digits in total",
      (value) => {
        if (!value) return true;

        // Remove the decimal point and count total digits
        const cleanValue = value.replace(".", "");

        // Check if the total number of digits (integer + decimal) is at most 15
        return cleanValue.length <= 15;
      }
    )
    .test(
      "max-integer-digits",
      "Cost must have a maximum of 15 integer digits",
      (value) => {
        if (!value) return true;

        const integerPart = value.split(".")[0] || "";

        // Check if the integer part has at most 15 digits
        return integerPart.length <= 15;
      }
    ),
});

export default editValidationSchema;
