import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'


class NavLink extends React.Component {
    render() {
	const {
	    active_path,
	    dispatch,
	    ...rest
	} = this.props

        var isActive = active_path === this.props.to;
        var className = isActive ? 'active' : '';

        return(
	    <li className={className}>
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

const stateToProps = state => ({
    active_path: state.router.location.pathname
})

export default connect(stateToProps)(NavLink);
