/*
** Comment me
*/

import React from 'react'
import template from './navigation.rt'
import PropTypes from 'prop-types';


class MainNavigation extends React.Component {
    render() {
        return template.apply(this);
    }
}

MainNavigation.propTypes = {
    authenticated: PropTypes.bool.isRequired
};


export default MainNavigation
