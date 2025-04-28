import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./PhoneNumberPicker.scss"
const PhoneNumberPicker = ({ value, onChange, defaultCountry = "lb" }) => {
  return (
    <div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root input-form white css-wb57ya-MuiFormControl-root-MuiTextField-root PhoneNumberPicker">
      <div className="MuiInputBase-root MuiFilledInput-root MuiFilledInput-underline MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-gzsp9t-MuiInputBase-root-MuiFilledInput-root">
        <PhoneInput
          country={defaultCountry}
          inputClass="fw-white"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default PhoneNumberPicker;
