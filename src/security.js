/*
** Comment me
*/ 

import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import PropTypes from 'prop-types';
import { FLASH_WARNING, addTemporaryMessage } from './actions/flash'


const Unauthorized = props => {
    props.flash(FLASH_WARNING, "You are not allowed here");
    return <Redirect to={ props.to } />;
}


Unauthorized.propTypes = {
    to: PropTypes.string.isRequired,
    flash: PropTypes.func.isRequired,
};


class SecureRoute extends Route {
    render() {
        if (!this.props.authenticated) {
            return <Unauthorized to="/login"
	              flash={this.props.addTemporaryMessage }/>
        }
        return <this.props.component />
    }
}

SecureRoute.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    addTemporaryMessage: PropTypes.func.isRequired,
};

const stateToProps = state => ({
    authenticated: state.authReducer.logged,
})

export default connect(stateToProps, { addTemporaryMessage })(SecureRoute)


