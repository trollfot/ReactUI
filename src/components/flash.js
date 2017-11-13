/*
** Comment me
*/

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
    deleteFlashMessage,
    FLASH_INFO,
    FLASH_WARNING,
    FLASH_ERROR
} from '../actions/flash';


class FlashMessage extends React.Component {
    constructor(props) {
	super(props);
	this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
	this.props.deleteFlashMessage(this.props.message.id);
    }
    
    render() {
	const { id, type, text } = this.props.message;
	return (
		<div className={classnames('alert', {
		    'alert-success': type === FLASH_INFO,
		    'alert-warning': type === FLASH_WARNING,
		    'alert-danger': type === FLASH_ERROR,
		})}>
		<button onClick={this.onClick} className="close">
		  <span>&times;</span>
		</button>
		<span>{text}</span>
	    </div>
	);
    }
}

FlashMessage.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}

export default FlashMessage;
