/*
** Comment me
*/

import React from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { userLogout } from '../actions/auth'
import { flushFlashMessages } from '../actions/flash'
import PropTypes from "prop-types";


const LogoutPage = ({push, userLogout, flushFlashMessages}) => {
    userLogout();
    flushFlashMessages();
    push('/');
    return null;
};

LogoutPage.propTypes = {
    userLogout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    flushFlashMessages: PropTypes.func.isRequired,
}

export default connect(
    null, { push, userLogout, flushFlashMessages }
)(LogoutPage)
