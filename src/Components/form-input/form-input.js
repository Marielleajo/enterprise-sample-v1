import React from 'react';
import './form-input.scss';
import InputLengthCount from '../form-input-length-count/form-input-length-count';
const FormInput = (props) => {
    const {handleChange, containerClass, showCharLength, label, inputLoader, containerWidth, ...otherProps} = props;
    return (
        <React.Fragment>
            <div className={containerClass ? containerClass : `position-relative`} style={{'width': containerWidth}}>
                <input onChange={handleChange} {...otherProps} />
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

export default FormInput;