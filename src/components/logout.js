/*
** Comment me
*/

import React from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { userLogout } from '../actions/auth'
import { FLASH_INFO,
	 addTemporaryMessage,
	 flushFlashMessages } from '../actions/flash'


const LogoutPage = ({
    push, userLogout, addTemporaryMessage, flushFlashMessages
}) => {
    userLogout();
    flushFlashMessages();
    addTemporaryMessage(FLASH_INFO, 'You have been disconnected');
    return <Redirect to="/" />;
};

LogoutPage.propTypes = {
    userLogout: PropTypes.func.isRequired,
    flushFlashMessages: PropTypes.func.isRequired,
    addTemporaryMessage: PropTypes.func.isRequired,
}

export default connect(
    null, { userLogout, addTemporaryMessage, flushFlashMessages }
)(LogoutPage)
