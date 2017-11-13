/*
**
*/

import axios from 'axios'
import { LOGIN_URL } from '../config'
import { FLASH_INFO, FLASH_ERROR, addFlashMessage } from './flash'
import {
    AUTH_SUCCESS,
    AUTH_FAIL,
    LOGOUT
} from './types'


const authHeader = () => ({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
})

const authSuccess = token => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    return {
	type: AUTH_SUCCESS,
	token: token
    }
}

const authFail = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
    return {
	type: AUTH_FAIL
    }
}

export const userLogout = () => {
    localStorage.removeItem('token');
    return {
	type: LOGOUT
    }
}

export function login(data) {
    return dispatch => {
	return axios.post(LOGIN_URL, data, {
	    headers: {
		'Content-Type': 'application/json'
	    }
	}).then(response => {
	    dispatch(authSuccess(response.data.token));
	    dispatch(addFlashMessage(FLASH_INFO, "Logged in !"));
	}).catch(error => {
	    dispatch(authFail());
	    dispatch(addFlashMessage(FLASH_ERROR, error.message));
	    throw error
	});
    }
}
