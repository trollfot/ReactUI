/*
** Comment me
*/

import React from 'react'
import template from './navigation.rt'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'


class MainNavigation extends React.Component {
    render() {
        return template.apply(this);
    }
}

MainNavigation.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const stateToProps = state => ({
    authenticated: state.authReducer.logged,
})

export default connect(stateToProps)(MainNavigation)
