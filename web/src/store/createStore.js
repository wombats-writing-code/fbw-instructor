import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import persistState from 'redux-localstorage'
import _ from 'lodash'
import {stampNewMission} from 'fbw-platform-common/reducers/edit-mission'
import moment from 'moment'

import makeRootReducer from '../reducers/'
import { updateLocation } from '../reducers/location'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // copy state to local storage
  enhancers.push(persistState(null, {
    slicer: paths => state => {
      if (state) {
        let subset = {
          course: state.course,
          result: _.omit(state.result, [
            'phaseIResults', 'phaseIIResults',
            'isGetResultsInProgress',
          ]),
          editMission: _.assign({}, state.editMission, {
            newMission: stampNewMission(),
            isCreateMissionInProgress: false
          }),
          mapping: state.mapping,
          mission: _.assign({}, state.mission, {
            currentTarget: null,
            isGetMissionInProgress: false,
            isGetMissionsInProgress: false
          }),
          login: state.login,
          location: state.location,
          view: state.view
        };

        return subset;
      }

      // console.log('storing state:', subset)

      return {};
    },
    deserialize: serialized => {
      let state = JSON.parse(serialized);
      if (state) {
        state.editMission.spawnDate = {
          startTime: moment(),
          deadline: moment().add(7, 'd')
        }
        console.log('deserialized', state);

        return state;
      }

      return {}
    }
  }))

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('../reducers/', () => {
      const reducers = require('../reducers/').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
