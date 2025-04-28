import React from 'react';
import './form-select.scss';
const FormSelect = (props) => {
    const {handleChange, text, placeholder, value, options, ...otherProps} = props;
    const updatedOptions = [{"text": placeholder, "value": ""}, ...options];
    return(
          <div className="position-relative">
            {text ? <label>{text}</label> : ''}
            <select value={value} onChange={handleChange} {...otherProps} >
              {updatedOptions.map((option, idx) => {
                return <option key={idx} value={option.value} label={option.text}>{option.text}</option>
              })} 
            </select>
          </div>)
}

export default FormSelect;