/*
** Comment me
*/

import React from 'react';
import axios from 'axios'
import Upload from 'rc-upload';
import download from './download'
import {
    ASSETMANAGE_URL,
    getWebsocketURL
} from '../config';
import { authHeader } from '../actions/auth'
import { CANCELLED, UPLOADED } from './states';
import UploaderTemplate from './uploader.rt'


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
	    progress: 0,
	    status: null
	}
	
	this.setState({
	    uploadedFiles: upfiles
	})
    }

    onStart(file) {
	// Do something ?
    }

    close(uid) {
	let upfiles = this.state.uploadedFiles;
	if (!upfiles[uid].status) {
	    // CANCEL UPLOAD
	    let xhrs = this.refs.inner.uploader.reqs;
	    if (xhrs.hasOwnProperty(uid)) {
		xhrs[uid].abort();
		delete xhrs[uid];
		upfiles[uid].status = CANCELLED;
	    } else {
		console.log("Cannot abort this transaction.")
	    }
	} else {
	    // REMOVE LIST ITEM
            delete upfiles[uid];
	}
	this.setState({
	    uploadedFiles: upfiles
	})
    }

    onProgress(step, file) {
	let upfiles = this.state.uploadedFiles;
	if (upfiles.hasOwnProperty(file.uid)) {
	    upfiles[file.uid]['progress'] = Math.round(step.percent)
	    this.setState({
		uploadedFiles: upfiles
	    })
	} else {
	    console.log('Update of deleted file skipped')
	}
    }

    onSuccess(result, file, xhr) {
	let upfiles = this.state.uploadedFiles;
	upfiles[file.uid].status = UPLOADED;
	this.setState({
	    uploadedFiles: upfiles
	})
    }

    onError(err) {
	// Do something ?
    }

    render() {
	return UploaderTemplate.apply(this);
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
	    <div className="row">
                <div className="col-xs-12 col-md-3">
		  <div className="callout callout-container callout-info">
		    <h3>Upload new files</h3>
                    <AssetFilesUploader assetId={ params.assetId } />
		  </div>
                </div>
                <div className="col-xs-12 col-md-9">
		   <h3>Live file manager</h3>
	           <OnDiskFiles assetId={ params.assetId }
	                        ondisk_files={this.state.ondisk_files} />
                </div>
            </div>
	 )
    }
};

export default AssetFilemanager
