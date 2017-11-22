/*
** Comment me
*/

import axios from 'axios'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';

import NavLink from "./link";
import { ASSETCONSULT_URL } from '../config';


export const AssetOptions = props => (
  <div className="asset-options">
     <ul className="nav nav-pills">
      <NavLink to={`/assets/${props.matched}`}>
          View
      </NavLink>
	<NavLink to={`/assets/${props.matched}/manage`}>
	  Manage files
      </NavLink>
    </ul>
  </div>
)


export class AssetPage extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    asset: null,
	}
    }
    
    componentDidMount() {
	const { match: { params } } = this.props;

	axios.get(
	    ASSETCONSULT_URL + '/' + params.assetId
	).then((response) => {
	    this.setState({
		asset: response.data
	    });
	});
	// MISSING : handle error.
    }

    render() {
	if (this.state.asset) {
            return (
		<div id="asset">
                    <h1>{ this.state.asset.name }</h1>
		</div>
	    )
	}
	return <ReactLoading type="bubbles" color="#444" />
    }
}


export class AssetManage extends React.Component {
    render() {
	return (<h2>Coming soon</h2>)
    }
}
