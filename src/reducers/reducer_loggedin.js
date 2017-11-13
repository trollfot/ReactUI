/*
** Comment me
*/

import {
    AUTH_SUCCESS,
    AUTH_FAIL,
    LOGOUT
} from '../actions/types'


const initialState = {
    logged: false,
    token: null
}

const authReducer = (state = initialState , action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
	  return {
            ...state,
            logged: true,
	    token: action.token
          }
        case AUTH_FAIL:
          return {
            ...state,
            logged: false,
	    token: null
          }
	case LOGOUT:
          return {
	    ...state,
            logged: false,
	    token: null
          }
        default:
          return state
    }
}

export default authReducer;
