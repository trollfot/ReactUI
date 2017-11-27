/*
** Comment me
*/

import React from 'react'
import axios from 'axios'
import Upload from 'rc-upload'
import download from './download'
import shortid from 'shortid'
import {
    ASSETMANAGE_URL,
    getWebsocketURL
} from '../config';
import { authHeader } from '../actions/auth'
import { CANCELLED, UPLOADED } from './states';
import UploaderTemplate from './uploader.rt'
import InlineEdit from 'react-edit-inplace';
import { connect } from 'react-redux'
import {
    addTemporaryMessage,
    FLASH_INFO,
    FLASH_WARNING,
    FLASH_ERROR
} from '../actions/flash';
import ERRNOS from '../errnos';


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


function folder_listing(payload) {
    this.setState({
	ondisk_files: payload.files
    })
}


function folder_files_added(payload) {
    // payload is a list of files
    this.setState({
	ondisk_files: [...this.state.ondisk_files, ...payload.files]
    })
}


function folder_file_deleted(payload) {
    // payload is the name of the delete file
    let update = this.state.ondisk_files.filter(
	file => file.name !== payload.filename)
    this.setState({
	ondisk_files: update
    })
}


function folder_file_moved(payload) {
    // payload is the name of the delete file
    let files = this.state.ondisk_files
    let file = files.filter(file => file.name == payload.from)[0];
    file.name = payload.to;
    this.setState({
	ondisk_files: files
    })
}


const filemanager_events = {
    'folder_listing': folder_listing,
    'files_added': folder_files_added,
    'file_deleted': folder_file_deleted,
    'file_moved': folder_file_moved
}


@connect(null, { addTemporaryMessage })
class OnDiskFiles extends React.Component {

    constructor(props) {
	super(props)
	this.state = {
	    websocket: null,
	    pending_reports: {},
	    ondisk_files: []
	}
    }

    componentDidMount() {
      console.log(this.state.ondisk_files);
	let ws_location = getWebsocketURL(
	    '/manage/' + this.props.assetId);
	const ws = new WebSocket(ws_location);
	ws.onmessage = this.handleData.bind(this);
	this.setState({
	    websocket: ws
	})
    }

    handleData(message) {
	let result = JSON.parse(message.data);
	switch(result.type) {

	    case 'event':
	       if (filemanager_events.hasOwnProperty(result.name)) {
		 let action = filemanager_events[result.name].bind(this);
		 action(result.payload);
	       }
	       else {
		 console.log("Unknown event: " + result.name);
	       }
	       break;
 
	    case 'report':
	        if (result.hasOwnProperty('metadata')) {
		    if (result.metadata.hasOwnProperty('uid')) {
			if (this.state.pending_reports.hasOwnProperty(
			    result.metadata.uid)) {
			    let pending = this.state.pending_reports;
			    delete pending[result.metadata.uid];
			    this.setState({
				pending_reports: pending
			    })
			}
		    }
	        }
	        if (result.success == true) {
		 this.props.addTemporaryMessage(
		     FLASH_INFO, `(${result.action}) Report: ` + JSON.stringify(result.payload));
		} else {
		   if (ERRNOS.hasOwnProperty(result.errno)) {
		       let error = ERRNOS[result.errno];
		   } else {
		       let error = `Unknown error code ${result.errno}`;
		   }
	           if (result.errno > 100) {
		       error = `(${result.action}) Report : ` + error
		   }
		   this.props.addTemporaryMessage(FLASH_ERROR, error);
		}
	        break;
	    default:
	      console.log("Unknown incoming message type : " + result.type);
	}
    }

    dataChanged(original, data) {
	let action = {
	    action: "rename",
	    payload: {
		from: original,
		to: data.filename
	    },
	    metadata: {
		uid: shortid.generate()
	    }
	}
	let uid = shortid.generate();
	let pending = this.state.pending_reports;
	pending[uid] = action
	this.state.websocket.send(JSON.stringify(action));
	this.setState({
	    pending_reports: pending
	})
    }

    customValidateText(text) {
	return (text.length > 0 && text.length < 64);
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
	      { this.state.ondisk_files.map((file, index) => (
	        <tr key={index}>
		  <td>
		    <a name={file.name}
		       onClick={() => {
		           DownloadAndSave(this.props.assetId, file.name)
		     }}>{file.name}</a>
		     <InlineEdit
			 validate={this.customValidateText}
			 activeClassName="editing"
			 text={file.name}
			 paramName="filename"
			 change={(data) => {
			    this.dataChanged(file.name, data)}
			 }
			 />
		  </td>
		  <td>{file.size}</td>
		  <td>{file.mime[0]}</td>
	        </tr>
	      ))}
	    </tbody>
	  </table>
	</div>
      )
    }
}


class AssetFilesUploader extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    uploadedFiles: {}
	}
	this.uploaderProps = {
	    action: ASSETMANAGE_URL + '/' + props.assetId,
	    headers: {
		Authorization: authHeader()['Authorization'],
	    },
	    multiple: false,
	    onStart: this.onStart.bind(this),
	    onProgress: this.onProgress.bind(this),
	    onSuccess: this.onSuccess.bind(this),
	    onError: this.onError.bind(this)
	}
    }

    onStart(file) {
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


const AssetFilemanager = ({ match: { params } }) => (
	    <div className="row">
                <div className="col-xs-12 col-md-3">
		  <div className="callout callout-container callout-info">
		    <h3>Upload new files</h3>
                    <AssetFilesUploader assetId={ params.assetId } />
		  </div>
                </div>
                <div className="col-xs-12 col-md-9">
		   <h3>Live file manager</h3>
	           <OnDiskFiles assetId={ params.assetId } />
                </div>
            </div>
)

export default AssetFilemanager
