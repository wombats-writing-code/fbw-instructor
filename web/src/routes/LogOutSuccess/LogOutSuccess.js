import React, { Component } from 'react'
import { browserHistory } from 'react-router'


class LogOutSuccess extends Component {

  componentDidMount() {
    browserHistory.push('/login')
  }

  render() {
    return (
      <div className="logout-success flex-container justify-center align-center">
      </div>)
  }

}

export default LogOutSuccess
