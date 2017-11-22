/*
   Assets sub navigation.
*/

import React from 'react';
import { Route, Switch } from 'react-router-dom'
import AssetFilemanager from '../components/filemanager.js'
import {
    AssetPage,
    AssetOptions,
} from '../components/asset.js'
import {
    AssetsNav,
    AssetsAdd,
    AssetsHome,
    AssetsBrowser,
} from '../components/assets.js'


const Asset = ({ match }) => (
  <div className="panel panel-info">
    <div className="panel-heading">
       <AssetOptions matched={ match.params.assetId }/>
    </div>
    <div className="panel-body">
      <Switch>
	<Route path="/assets/:assetId" exact component={AssetPage} />
	<Route path="/assets/:assetId/manage" component={AssetFilemanager} />
      </Switch>
    </div>
  </div>
)


export const Assets = () => (
  <div className="assets-sub-layout">
    <aside>
      <AssetsNav />
    </aside>
    <div className="primary-content tab-content">
      <Switch>
        <Route path="/assets" exact component={AssetsHome} />
        <Route path="/assets/create" component={AssetsAdd} />
	<Route path="/assets/browse" component={AssetsBrowser} />
	<Route path="/assets/:assetId" component={Asset} />
      </Switch>
    </div>
  </div>
)
