import React, {Component} from 'react'
import './NavBar.scss'


export default (props) => {

  return (
    <div className="nav-bar">
      <h1 className="app-title">
        <span className="fbw-name">Fly-by-Wire</span>
        <span className="app-name">Instructor App</span>
      </h1>
      <button className="logout-button" tabIndex="1" onClick={this._logout}>
        Logout
      </button>
    </div>
  )

  _logout = () => {
    browserHistory.push('/login')
    this.props.logout();
  }
}
