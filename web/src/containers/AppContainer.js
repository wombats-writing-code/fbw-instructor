import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'

import {retrieveUser} from '../reducers/User/retrieveUser'

require('../styles/foundation.min.css');


class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  componentDidMount() {
    const store = this.props.store;
    store.dispatch(retrieveUser())
    .then( () => {
      const state = store.getState();      // because AppContainer is the top-level parent

      console.log('state in AppContainer', state)

      if (!state.user.user) {
        browserHistory.push('/login')
      }
    })

  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer
