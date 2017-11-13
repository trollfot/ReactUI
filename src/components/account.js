/*
** Comment me
*/

import axios from 'axios'
import React from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';

import { NavLink } from 'react-router-dom';
import { PROFILE_URL } from '../config';


export const UserNav = () => (
  <header>
    <h2>Mes options</h2>
    <nav>
      <NavLink to="/account" exact activeClassName="active">
        Accueil du compte
      </NavLink>
      <NavLink to="/account/profile" activeClassName="active">
	Profil
      </NavLink>
    </nav>
  </header>
)


export const BrowseUsersPage = () => (
  <div className="user-sub-layout">
    <div className="primary-content">
      Ma page.
    </div>
  </div>
)


export class UserProfilePage extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    profile: null,
	}
    }

    componentDidMount() {
	if (!this.state.profile) {
	    axios.get(PROFILE_URL).then((response) => {
		this.setState({profile: response.data})
	    }).catch((err) => {
		console.log(err)
	    })
	}
    }

    render() {
	if (this.state.profile) {
            return (
             <div className="container">
               <div className="row">
                 <div className="col-sm-6 col-md-4 col-lg-3 mt-4 col-xs-offset-1 col-md-offset-1 col-lg-offset-1">
                   <div className="card">
                     <img className="card-img-top" src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" />
                     <div className="card-block">
                     <h4 className="card-title">
		           { this.state.profile.fullname }
		     </h4>
                     <div className="meta">
		        { this.state.profile.emails.join(', ') }
                      </div>
                     <div className="card-text">
		         { this.state.profile.title }
                     </div>
                   </div>
                   <div className="card-footer">
                      <span className="float-right">
		        Joined the { this.state.profile.created }
		      </span>
                   </div>
                 </div>
	       </div>
	     </div>
           </div>
	 )
        }
	return <ReactLoading type="bubbles" color="#444" />
    }
}
