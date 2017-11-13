/*
** Comment me
*/

import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FlashMessage from './flash'
import { deleteFlashMessage } from '../actions/flash';


class FlashMessagesList extends React.Component {
    render() {
      return this.props.messages.map(message =>
	<FlashMessage key={message.id}
		      message={message}
		      deleteFlashMessage={this.props.deleteFlashMessage} />
    );
  }
}


FlashMessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}


const stateToProps = state => {
    return {
      messages: state.flashReducer
    }
}


export default connect(
    stateToProps, { deleteFlashMessage }
)(FlashMessagesList);
