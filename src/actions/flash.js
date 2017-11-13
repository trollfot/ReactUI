/*
** Comment me
*/

import shortid from 'shortid'
import {
    ADD_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGES,
    FLUSH_FLASH_MESSAGES
} from './types';


export const FLASH_INFO = 'info'
export const FLASH_WARNING = 'warning'
export const FLASH_ERROR = 'error'


export function addFlashMessage(type=FLASH_INFO, message, id=null) {
  return {
      type: ADD_FLASH_MESSAGE,
      message: {
	  id: id ? id : shortid.generate(),
	  type: type,
	  text: message
      }
  }
}

export function deleteFlashMessage(id) {
  return {
    type: DELETE_FLASH_MESSAGE,
    id
  }
}

export function deleteFlashMessages(messageType) {
  return {
    type: DELETE_FLASH_MESSAGES,
    messageType
  }
}

export function flushFlashMessages() {
  return {
    type: FLUSH_FLASH_MESSAGES,
  }
}


export function addTemporaryMessage(type=FLASH_INFO, message, timeout=5000) {
    return dispatch => {
	const id = shortid.generate();
	dispatch(addFlashMessage(type, message, id));
	setTimeout(() => {
	    dispatch(deleteFlashMessage(id));
	}, timeout)
    }
}
