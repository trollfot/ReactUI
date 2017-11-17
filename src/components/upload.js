/*
** Comment me
*/

import React from 'react';
import { post } from 'axios';
import XHRUploader from 'react-xhr-uploader'
import Websocket from 'react-websocket';
import { getWebsocketURL } from '../config';

class Upload extends React.Component {

    constructor(props) {
	super(props)
	let ws_location = getWebsocketURL('manage', 'test');
	console.log(ws_location);
	const ws = new WebSocket(ws_location);
	ws.onmessage = this.handleData.bind(this);
	this.state = {
	    websocket: ws
	}
    }

    handleData(message) {
	console.log(message.data);
	let result = JSON.parse(message.data);
	if (result.hasOwnProperty('authenticate')) {
	    let authentication = {
		jwt: localStorage.getItem('token')
	    }
	    this.state.websocket.send(JSON.stringify(authentication));
	}
    }

    render() {
	return (
	    <div id="uploader">
		<XHRUploader url='http://geth.comeonweb.com:9090/entity/upload'
                             maxFiles='5' />
	    </div>
	 )
    }
};

export default Upload
