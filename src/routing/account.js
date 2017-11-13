/*
   Account sub navigation.
*/

import React from 'react';
import { Route, Switch } from 'react-router-dom'
import {
    UserNav,
    BrowseUsersPage,
    UserProfilePage
} from '../components/account'


const Account = () => (
  <div className="user-sub-layout">
    <aside>
      <UserNav />
    </aside>
    <div className="primary-content">
      <Switch>
        <Route path="/account" exact component={BrowseUsersPage} />
        <Route path="/account/profile" component={UserProfilePage} />
      </Switch>
    </div>
  </div>
)

export default Account
