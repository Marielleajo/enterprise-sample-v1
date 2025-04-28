import React from "react";
import './Stepers.scss';
import {ReactComponent as CompletedTick} from '../../assets/completed_tick.svg';
import PropTypes from 'prop-types';

const Steppers = (props) => {
  const {steps, activeIndex, width, ...otherProps} = props;
  return (
      <div {...otherProps} style={{'width': width}}>
          <div className="stepers">
                <ul className="d-flex">
                    {steps.map((step, idx) => {
                        return (
                            <li className="position-relative" key={idx}>
                                <span className={idx===activeIndex ? 'step-nav d-block active' : `step-nav d-block ${step.completedClass}`}>
                                    {step.completedClass==='completed'? <i><CompletedTick/></i> : step.id}
                                </span>
                                {step.label ? <span className={idx===activeIndex ? 'active step-label position-absolute' : `step-label position-absolute ${step.completedClass}`}>{step.label}</span> : ''}
                            </li>
                        )
                    })}
                </ul>
          </div>
      </div>
  );
}

Steppers.propTypes = {
    steps: PropTypes.array.isRequired,
    activeIndex: PropTypes.number
};

export default Steppers;