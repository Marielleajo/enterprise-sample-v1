import React from 'react';
import './toggle-btn.scss';

class ToggleBtn extends React.Component{
    state = {
        btnFlag: this.props.btnFlag
    }
    handleToggleChangeInternal = () => {
        this.setState({
            btnFlag: !this.state?.btnFlag
        })
        // this.props.handleToggleChange()
    }
    render () {
        const {handleToggleChange, className, btnFlag, label, ...otherProps} = this.props;
        const activeClass = this?.state?.btnFlag ? 'activeToggleBtn' : 'inActiveToggleBtn';
        return (
            <div onClick={this?.handleToggleChangeInternal} {...otherProps} className={className ? className : `custom-control custom-switch`}>
                {/* <input type="checkbox" className="custom-control-input" checked={btnFlag} id={`customSwitches${gameId}`}/> */}
                
                <label className={`custom-control-label ${activeClass}`}>{label}</label>
            </div>
        )
    }
    
}

export default ToggleBtn;