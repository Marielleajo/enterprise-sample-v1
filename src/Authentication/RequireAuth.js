import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signOut } from "../Redux/Actions/index";

var jwtDecode = require("jwt-decode");

/*
    This Higher Order Component checks if there is a VALID & NON expired token.
    But there is an issue. In our system we have two types of tokens.
    One is called 'token' which is the token that lets you in into a service like: 1- MVisa 2- CallSignature ...
    One is called mainToken which is the token that lets you in into: 1- Main/Headquarter Dashboard 2- Operator Dashboard

    When we are inside the service and we decide to go back into 1- Main/Headquarter Dashboard 2- Operator Dashboard 
    Then there is a token transaction/switch that is happening. 'token' is deleted through dispatched action and is replaced
    with 'mainToken' also through dispatched action.
    When this happens we have problem, the class RequireAuth can't just check for 'token', it should also check for the existence of
    'mainToken'. If 'mainToken' exists while 'token' doesn't then a switch is happening, therefore we don't want to make a call to signOut action.
*/
const requireAuth = (ComposedComponent) => {
    class RequireAuth extends Component {
        componentWillMount() {
            let decoded = this.props.token ? jwtDecode(this.props.token) : "";
            if (!decoded) {
                let mainTokenDecoded = this.props.mainToken ? jwtDecode(this.props.mainToken) : "";
                if(!mainTokenDecoded){
                    // if we don't have 'token' and 'mainToken' then we will execute the signOut process
                    this.props.signOut();
                    this.props.history.push("/")
                }
            } else {
                let tokenExp = decoded.exp;
                let judgement_Date = new Date(0); // The 0 there is the key, which sets the date to the epoch
                judgement_Date.setUTCSeconds(tokenExp);
                if (judgement_Date.getTime() - (new Date()).getTime() < 0) {
                    this.props.signOut();
                    this.props.history.push("/")
                }
            }
        }
        componentWillUpdate() {
            let decoded = this.props.token ? jwtDecode(this.props.token) : "";
            if (!decoded) {
                let mainTokenDecoded = this.props.mainToken ? jwtDecode(this.props.mainToken) : "";
                if(!mainTokenDecoded){
                    // if we don't have 'token' and 'mainToken' then we will execute the signOut process
                    this.props.signOut();
                    this.props.history.push("/")
                }
            } else {
                let tokenExp = decoded.exp;
                let judgement_Date = new Date(0); // The 0 there is the key, which sets the date to the epoch
                judgement_Date.setUTCSeconds(tokenExp);
                if (judgement_Date.getTime() - (new Date()).getTime() < 0) {
                    this.props.signOut();
                    this.props.history.push("/")
                }
            }
        }
        render() {
            return (
                <ComposedComponent {...this.props} />
            )
        }
    }
    const mapStateToProps = (state, ownProps) => ({
        token: state.authentication ? state.authentication.token : "",
        mainToken: state.authentication ? state.authentication.mainToken : ""
    })

    const mapDispatchToProps = (dispatch, ownProps) => ({
        signOut: () => dispatch(signOut())
    })

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(RequireAuth);
}

export default requireAuth