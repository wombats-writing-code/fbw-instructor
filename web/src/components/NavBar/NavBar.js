import React, {Component} from 'react'
import {Link} from 'react-router'
import './NavBar.scss'

import {usernameToDisplayName} from 'fbw-platform-common/selectors/login'


export default (props) => {

  return (
    <div className="nav-bar flex-container align-center space-between">
      <h1 className="app-title">
        <span className="fbw-name">Fly-by-Wire</span>
        <span className="app-name">Instructor App</span>
      </h1>
      <p className="username">
        {usernameToDisplayName(props.username)}
      </p>
      <div>
        <Link className="guide-link" to="guide" target="_blank">Guide</Link>
        <button className="logout-button" tabIndex="1" onClick={props.logout}>
          Logout
        </button>
      </div>

    </div>
  )

}
