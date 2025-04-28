import React from 'react';
import './custom-loader.scss';
import { Spinner } from 'reactstrap';

const CustomerLoader = (props) => {
    const {message, ...otherProps} = props;
    return (
            <React.Fragment>
                <div className={'customer-loader-overlay'}></div>
                <div className={'customer-loader-progress'} {...otherProps}>
                    <span className={'customer-loader-message'}>{message}</span> <Spinner animation="border" variant="primary" />
                </div>
            </React.Fragment>
    )
}

export default CustomerLoader;