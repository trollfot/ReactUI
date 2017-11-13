/*
** Comment me
*/

import axios from 'axios'
import React from 'react';
import Form from 'react-jsonschema-form';
import ReactLoading from 'react-loading';

import { login } from '../actions/auth'
import { FLASH_INFO } from '../actions/flash'
import store from '../store'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

    
class LoginForm extends React.Component {
 
    constructor(props) {
	super(props);
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
        this.props.login(form.formData).then(value => {
	    this.props.push('/');
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

export default connect(null, { push, login })(LoginForm)
