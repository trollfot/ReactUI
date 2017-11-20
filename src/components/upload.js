/*
** Comment me
*/

import React from 'react';
import axios from 'axios'
import XHRUploader from 'react-xhr-uploader'
import Websocket from 'react-websocket';
import download from './download'
import {
    ASSETUPLOAD_URL,
    ASSETDOWNLOAD_URL,
    getWebsocketURL
} from '../config';


function DownloadAndSave(fileName) {
    axios.get(ASSETDOWNLOAD_URL, {
	params: {
	    filename: fileName
	},
	responseType: 'blob'
    }).then((response) => {
	download(response.data, fileName);
    }).catch((err) => {
	console.log(err)
    })
}


function folder_summary(payload) {
    this.setState({
	files: payload
    })
}


function folder_add_files(payload) {
    // payload is a list of files
    this.setState({
	files: [...this.state.files, ...payload]
    })
}


function folder_delete_file(payload) {
    // payload is the name of the delete file
    let update = this.state.files.filter(file => file.name !== payload)
    this.setState({
	files: update
    })
}


const filemanager_actions = {
    'summary': folder_summary,
    'added': folder_add_files,
    'deleted': folder_delete_file
}


class Upload extends React.Component {

    constructor(props) {
	super(props)
	let ws_location = getWebsocketURL('manage', 'test');
	const ws = new WebSocket(ws_location);
	ws.onmessage = this.handleData.bind(this);
	this.state = {
	    websocket: ws,
	    files: []
	}
    }

    handleDownload(event) {
	DownloadAndSave(event.currentTarget.name)
    }
    
    handleData(message) {
	let result = JSON.parse(message.data);
	for (let key in result) {
	    let payload = result[key]
	    if (filemanager_actions.hasOwnProperty(key)) {
		let action = filemanager_actions[key].bind(this);
		action(payload);
	    } else {
		console.log("unknown filemanager action: " + key);
	    }
	}
    }

    render() {
	return (
	    <div id="uploader">
	        <table className="table table-bordered table-striped">
		  <thead>
		    <tr>
		      <th>Filename</th>
		      <th>Size</th>
		      <th>Mimetype</th>
		    </tr>
		  </thead>
		  <tbody>
		    { this.state.files.map((file, index) => (
		      <tr key={index}>
		        <td>
			  <a name={file.name} onClick={this.handleDownload}
			    >{file.name}</a>
			</td>
		        <td>{file.size}</td>
		        <td>{file.mime[0]}</td>
		      </tr>
		    ))}
		  </tbody>
		</table>
		<XHRUploader url={ ASSETUPLOAD_URL } maxFiles='5' />
	    </div>
	 )
    }
};

export default Upload
