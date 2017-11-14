/*
** Comment me
*/

import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types';

/* Security route */
import SecureRoute from '../security'

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
    <MainNavigation />
    <div id="page-wrapper">
      <FlashMessagesList />
      <div className="container-fluid">
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/logout" exact component={LogoutPage} />
          <Route path="/login" exact component={
                 () => <LoginForm schema_url={ LOGIN_URL } />} />
          <SecureRoute path="/account" component={ Account } />
        </Switch>
      </div>
    </div>
  </div>
)

export default Root
