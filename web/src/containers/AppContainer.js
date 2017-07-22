import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'

import {isLoggedIn} from 'fbw-platform-common/selectors'

// import '../styles/foundation.min.css';
import '../styles/core.scss';

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  componentDidMount() {
    const store = this.props.store;
    const state = store.getState();      // because AppContainer is the top-level parent

    // console.log('state in AppContainer', state)
    if (window.location.pathname.indexOf('logout-success') > -1 || window.location.pathname.indexOf('guide') > -1) {
      // do nothing on the logout-succcess page

    } else if (window.location.pathname.indexOf('d2l-callback') === -1 && window.location.pathname.indexOf('guest-callback') === -1) {
      if (!isLoggedIn(state)) browserHistory.push('/login');

    } else {
      let unsub = store.subscribe(() => {
        let state = store.getState();
        // console.log('state changed', state);
        unsub();
        if (isLoggedIn(state))  browserHistory.push('/')
      })
    }
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
