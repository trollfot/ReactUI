/*
** Comment me
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'


class NavLink extends React.Component {
    render() {
	const {
	    rootNode,
	    ...rest
	} = this.props

	var active = ''
	var path = this.context.router.route.location.pathname;
	if (path == this.props.to){
	    active = 'active';
	}
	else if (path.startsWith(this.props.to + '/') && rootNode) {
	    active = 'active';
	}
        return(
	    <li className={active}>
	      <Link {...rest}>
                {this.props.children}
              </Link>
	    </li>
        );
    }
}

NavLink.contextTypes = {
    router: PropTypes.object
};

NavLink.propTypes = {
    rootNode: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired
}

NavLink.defaultProps = {
    rootNode: false,
    className: ''
}

export default NavLink;
