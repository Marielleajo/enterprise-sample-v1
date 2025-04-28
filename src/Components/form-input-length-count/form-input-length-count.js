import React from 'react';

const InputLengthCount = (props) => {
    const {charactercount, maxLength} = props;
    return (
        <span>{charactercount}/{maxLength}</span>
    )
}

export default InputLengthCount;