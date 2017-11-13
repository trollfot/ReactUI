/*
** Comment me
*/ 

import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types';
import { FLASH_WARNING, addTemporaryMessage } from './actions/flash'


const Unauthorized = props => {
    props.flash(FLASH_WARNING, "You are not allowed here");
    props.redirect(props.to);
    return null;
}


Unauthorized.propTypes = {
    to: PropTypes.string.isRequired,
    flash: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
};


const AuthorizedRoute = props => {
    const {
	component: Component,
	push,
	addTemporaryMessage,
	logged,
	...rest } = props
    return (
	    <Route {...rest} render={props => {
		return logged
		    ? <Component {...props} />
		    : <Unauthorized to="/login"
		                    flash={ addTemporaryMessage }
		                    redirect={ push } />
	    }} />
    )
}


AuthorizedRoute.propTypes = {
    addTemporaryMessage: PropTypes.func.isRequired,
    logged: PropTypes.bool.isRequired,
};

const stateToProps = state => ({
    logged: state.authReducer.logged,
})

export default connect(
    stateToProps, { push, addTemporaryMessage })(AuthorizedRoute)
