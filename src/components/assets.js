/*
** Comment me
*/

import axios from 'axios'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';
import Form from 'react-jsonschema-form';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import NavLink from "./link";
import { ASSETADD_URL, ASSETBROWSE_URL } from '../config';
import { addTemporaryMessage, FLASH_INFO } from '../actions/flash'


export const AssetsNav = () => (
  <div className="assets-nav">
     <h2>Mon patrimoine</h2>
     <ul className="nav nav-tabs">
      <NavLink to="/assets">
          Accueil
      </NavLink>
      <NavLink to="/assets/create">
	Create new asset
      </NavLink>
      <NavLink to="/assets/browse">
	List my assets
      </NavLink>
    </ul>
  </div>
)


export const AssetsHome = () => (
  <div>Welcome to your assets page</div>
)


class AssetsAdd extends React.Component {
 
    constructor(props) {
	super(props)
	this.state = {
	    schema: null,
	    errors: null
	}
	this.submit = this.submit.bind(this);
    }

    componentDidMount() {
	/* 
        ** If the schema properties is empty, load the schema from the
        ** remote login form GET method.
        */
	if (!this.state.schema) {
	    axios.get(
		this.props.schema_url
	    ).then((response) => {
		this.setState({schema: response.data})
	    }).catch((err) => {
		console.log(err)
	    })
	}
    }

    submit(form) {
	axios.post(ASSETADD_URL, form.formData, {
	    headers: {
		'Content-Type': 'application/json'
	    }
	}).then((response) => {
	    this.props.addTemporaryMessage(
		FLASH_INFO, "Created new asset : " + response.data.created
	    );
	    // Redirect me.
	}).catch((err) => {
	    console.log(err)
	})	
    }

    render() {
	if (this.state.schema) {
            return <Form schema={this.state.schema}
	                 onSubmit={this.submit} />
	}
	return <ReactLoading type="bubbles" color="#444" />
    }
}

AssetsAdd.defaultProps = {
    schema_url: ASSETADD_URL
}


exports.AssetsAdd = connect(null, { addTemporaryMessage })(AssetsAdd)


export class AssetsBrowser extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    batchSize: 3,
	    currentPage: 0,
	    total: 0,
	    items: null
	}
    }

    componentDidMount() {
	if (this.state.items == null) {
	    this.onChange(1);  // Init as the first page.
	}
    }

    onChange = (page) => {
	axios.get(ASSETBROWSE_URL, {
	    params: {
		start: (page - 1) * this.state.batchSize,
		size: this.state.batchSize,
	    },
	}).then((response) => {
	    const {total,
		   start,
		   size,
		   items } = response.data
	    
	    this.setState({
		batchSize: size,
		total: total,
		items: items,
		currentPage: page,
	    })
	}).catch((err) => {
	    console.log(err)
	})
    }

    render() {
	if (this.state.items != null) {
          return (
	     <div>
	        <table className="table table-bordered table-striped">
		  <thead>
		    <tr>
		      <th>Name</th>
		      <th>Address</th>
		      <th>Work force</th>
		    </tr>
		  </thead>
		  <tbody>
		    { this.state.items.map((asset, index) => (
		      <tr key={index}>
		        <td>
			   <Link to={`/assets/${asset.key}`}>
			     {asset.data.name}
			   </Link>
			</td>
		        <td>{asset.data.address}</td>
		        <td>{asset.data.workforce}</td>
		      </tr>
		    ))}
		  </tbody>
		</table>
                {(this.state.batchSize < this.state.total) &&
		    <Pagination
                       onChange={this.onChange}
		       showTotal={(total, range) =>
			    `${range[0]} - ${range[1]} / ${total} items`}
		       defaultPageSize={this.state.batchSize}
                       current={this.state.currentPage}
                       total={this.state.total}
                       showLessItems
                      />
		}
	      </div>
	    )
        }
	return <ReactLoading type="bubbles" color="#444" />
    }
}
