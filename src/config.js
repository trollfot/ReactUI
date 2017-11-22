/*
** Backend endpoints locations configuration.
*/

import { encodeData } from './utils'

export const MAIN_URL = "http://geth.comeonweb.com:9090"
export const WS_URL = "ws://geth.comeonweb.com:9090"

export const LOGIN_URL = MAIN_URL + "/account/login"
export const SIGNIN_URL = MAIN_URL + "/account/register"
export const PROFILE_URL = MAIN_URL + "/account/info"

export const ASSETBROWSE_URL = MAIN_URL + "/assets/browse"
export const ASSETADD_URL = MAIN_URL + "/assets/create"
export const ASSETMANAGE_URL = MAIN_URL + "/assets/manage"
export const ASSETCONSULT_URL = MAIN_URL + "/assets/asset"

export const WEBSOCKET_BASE_URL = WS_URL + "/live"


export const getWebsocketURL = (endpoint) => {
    let location = WEBSOCKET_BASE_URL + endpoint;
    let jwt = localStorage.getItem('token');
    if (jwt != null) {
	location += '?' + encodeData({jwt: jwt});
    }
    return(location);
}
