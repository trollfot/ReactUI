/*
** Comment me
*/

import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import FlashMessage from './flash'
import { deleteFlashMessage } from '../actions/flash';

import './flash.css';


const FlashMessagesList = props => (
       <TransitionGroup className="flashmessages">
          {props.messages.map((message, i) => (
	    <CSSTransition timeout={{ enter: 1000, exit: 800 }}
              classNames="fade" key={i}>
              <FlashMessage message={message}
		deleteFlashMessage={props.deleteFlashMessage} />
            </CSSTransition>
          ))}
        </TransitionGroup>
)


FlashMessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}


const stateToProps = state => ({
      messages: state.flashReducer
})


export default connect(
    stateToProps, { deleteFlashMessage }
)(FlashMessagesList);
