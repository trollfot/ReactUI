/*
** Comment me
*/

import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types';

/* Security route */
import AuthorizedRoute from '../security'

/* Sub routing */
import Account from './account';

/* Components */
import FlashMessagesList from '../components/flashlist';
import MainNavigation from '../components/nav';
import LoginForm from '../components/login';
import LogoutPage from '../components/logout';
import Homepage from '../components/homepage';

import { LOGIN_URL } from '../config.js'


const Root = props => (
  <div id="wrapper">
    <MainNavigation authenticated={ props.logged } />
    <div id="page-wrapper">
      <FlashMessagesList />
      <div className="container-fluid">
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/logout" exact component={LogoutPage} />
          <Route path="/login" exact component={
                 () => <LoginForm schema_url={ LOGIN_URL } />} />
          <AuthorizedRoute path="/account" component={ Account } />
        </Switch>
      </div>
    </div>
  </div>
)

Root.propTypes = {
    logged: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired
};

const stateToProps = state => ({
    logged: state.authReducer.logged,
    router: state.router
})

export default connect(stateToProps)(Root)
