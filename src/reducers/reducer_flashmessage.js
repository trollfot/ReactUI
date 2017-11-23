
import {
    ADD_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGE,
    DELETE_FLASH_MESSAGES,
    FLUSH_FLASH_MESSAGES
} from '../actions/types';


const flashReducer = (state = [] , action) => {
    switch (action.type) {
    case ADD_FLASH_MESSAGE:
	return [...state, action.message]

    case DELETE_FLASH_MESSAGE:
        return state.filter(
		message => message.id !== action.id)﻿

    case DELETE_FLASH_MESSAGES:
	return state.filter(
		message => message.type !== action.messageType)

    case FLUSH_FLASH_MESSAGES:
	return []

    default:
        return state
    }
}

export default flashReducer;
