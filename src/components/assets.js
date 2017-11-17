/*
** Comment me
*/

import axios from 'axios'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';
import Form from 'react-jsonschema-form';

import { connect } from 'react-redux'
import NavLink from "./link";
import { ENTITYADD_URL } from '../config';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';


export const AssetsNav = () => (
  <div className="assets-nav">
     <h2>Mes options</h2>
     <ul className="nav nav-tabs">
      <NavLink to="/assets">
          Accueil
      </NavLink>
      <NavLink to="/assets/create">
	Create new asset
      </NavLink>
    </ul>
  </div>
)

export const AssetsHome = props => (
  <div>Welcome to your assets page</div>
)


export class AssetsAdd extends React.Component {
 
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
	axios.put(ENTITYADD_URL, form.formData, {
	    headers: {
		'Content-Type': 'application/json'
	    }
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
    schema_url: ENTITYADD_URL
}
