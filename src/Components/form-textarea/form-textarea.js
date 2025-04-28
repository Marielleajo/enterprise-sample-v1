import React from 'react';
import './form-textarea.scss';
import InputLengthCount from '../form-input-length-count/form-input-length-count';
const FormTextArea = (props) => {
    const {containerClass, handleChange, showCharLength, label, ...otherProps} = props;
    return (
        <React.Fragment>
            <div className={containerClass ? containerClass + ` text-area` : `position-relative text-area`}>
                <textarea onChange={handleChange} {...otherProps} />
                {label ? (
                    <label
                        className={`${
                        otherProps.value.length ? "shrink" : ""
                        } form-input-label`}
                    >
                    {label}
                </label>
                ) : null}
                {showCharLength ? 
                <div className="show-char-length position-absolute">
                    <InputLengthCount {...otherProps}/>
                </div>
                :
                ''
                }
            </div>
            
        </React.Fragment>
        
    )
}

export default FormTextArea;