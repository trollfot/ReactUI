/*
** Comment me
*/

import React from 'react';
import axios from 'axios'
import Upload from 'rc-upload';
import download from './download'
import Progress from 'react-progressbar'
import {
    ASSETMANAGE_URL,
    getWebsocketURL
} from '../config';
import { authHeader } from '../actions/auth'


function DownloadAndSave(assetId, fileName) {
    let filename = encodeURIComponent(fileName);
    axios.get(ASSETMANAGE_URL + '/' + assetId + '/' + filename, {
	responseType: 'blob'
    }).then((response) => {
	download(response.data, fileName);
    }).catch((err) => {
	console.log(err)
    })
}


function folder_summary(payload) {
    this.setState({
	ondisk_files: payload
    })
}


function folder_add_files(payload) {
    // payload is a list of files
    this.setState({
	ondisk_files: [...this.state.ondisk_files, ...payload]
    })
}


function folder_delete_file(payload) {
    // payload is the name of the delete file
    let update = this.state.ondisk_files.filter(file => file.name !== payload)
    this.setState({
	ondisk_files: update
    })
}


const filemanager_actions = {
    'summary': folder_summary,
    'added': folder_add_files,
    'deleted': folder_delete_file
}


const OnDiskFiles = ({assetId, ondisk_files}) => (
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
	    { ondisk_files.map((file, index) => (
	      <tr key={index}>
		<td>
		    <a name={file.name}
		onClick={ ()=> { DownloadAndSave(assetId, file.name) } }
		    >{file.name}</a>
		</td>
		<td>{file.size}</td>
		<td>{file.mime[0]}</td>
	      </tr>
	    ))}
	  </tbody>
	</table>
    </div>
)


class AssetFilesUploader extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    uploadedFiles: {}
	}
    }

    componentDidMount() {
	console.log(this);
	this.uploaderProps = {
	    action: ASSETMANAGE_URL + '/' + this.props.assetId,
	    headers: {
		Authorization: authHeader()['Authorization'],
	    },
	    multiple: false,
	    beforeUpload: this.beforeUpload.bind(this),
	    onStart: this.onStart.bind(this),
	    onProgress: this.onProgress.bind(this),
	    onSuccess: this.onSuccess.bind(this),
	    onError: this.onError.bind(this)
	};
    }

    beforeUpload(file) {
	let upfiles = this.state.uploadedFiles;
	upfiles[file.uid] = {
	    name: file.name,
	    size: file.size,
	    type: file.type,
	    progress: 0
	}
	
	this.setState({
	    uploadedFiles: upfiles
	})
    }

    onStart(file) {
	console.log('onStart', file.name);
	// this.refs.inner.abort(file);
    }

    onProgress(step, file) {
	let upfiles = this.state.uploadedFiles;
	upfiles[file.uid]['progress'] = Math.round(step.percent)
	this.setState({
	    uploadedFiles: upfiles
	})
    }

    onSuccess(file) {
	console.log('onSuccess', file);
    }

    onError(err) {
	console.log('onError', err);
    }

    render() {
	return (
	    <div>
	      <Upload {...this.uploaderProps} ref="inner">
	        <a className="btn btn-primary">Chose files</a>
	      </Upload>
	      {
		  Object.keys(this.state.uploadedFiles).map((key, index) => ( 
	          <div key={index}>
		      {this.state.uploadedFiles[key].name}
		      <Progress completed={this.state.uploadedFiles[key].progress} />
	          </div>
	          ))
	      }
	    </div>
	);
  }
}


class AssetFilemanager extends React.Component {

    constructor(props) {
	super(props)
	let ws_location = getWebsocketURL(
	    '/manage/' + props.match.params.assetId);
	const ws = new WebSocket(ws_location);
	ws.onmessage = this.handleData.bind(this);
	this.state = {
	    websocket: ws,
	    ondisk_files: [],
	}
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
	const { match: { params } } = this.props;
	return (
	    <div>
	       <OnDiskFiles assetId={ params.assetId }
	                    ondisk_files={this.state.ondisk_files} />
		
		<AssetFilesUploader assetId={ params.assetId } />
	    </div>
	 )
    }
};

export default AssetFilemanager
