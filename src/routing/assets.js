/*
   Assets sub navigation.
*/

import React from 'react';
import { Route, Switch } from 'react-router-dom'
import {
    AssetsNav,
    AssetsAdd,
    AssetsHome,
    AssetsBrowser
} from '../components/assets'


const Assets = () => (
  <div className="assets-sub-layout">
    <aside>
      <AssetsNav />
    </aside>
    <div className="primary-content tab-content">
      <Switch>
        <Route path="/assets" exact component={AssetsHome} />
        <Route path="/assets/create" component={AssetsAdd} />
	<Route path="/assets/browse" component={AssetsBrowser} />
      </Switch>
    </div>
  </div>
)

export default Assets
