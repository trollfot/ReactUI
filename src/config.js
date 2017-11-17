/*
** Backend endpoints locations configuration.
*/

import { encodeData } from './utils'


export const MAIN_URL = "http://geth.comeonweb.com:9090"
export const WS_URL = "ws://geth.comeonweb.com:9090"

export const LOGIN_URL = MAIN_URL + "/account/login"
export const SIGNIN_URL = MAIN_URL + "/account/register"
export const PROFILE_URL = MAIN_URL + "/account/info"
export const ENTITYQUERY_URL = MAIN_URL + "/entity/query"
export const ENTITYADD_URL = MAIN_URL + "/entity/create"
export const WEBSOCKET_BASE_URL = WS_URL + "/live"


export const getWebsocketURL = (endpoint, action) => {
    let location = WEBSOCKET_BASE_URL + '/' + endpoint + '/' + action;
    let jwt = localStorage.getItem('token');
    if (jwt != null) {
	location += '?' + encodeData({jwt: jwt});
    }
    return(location);
}
