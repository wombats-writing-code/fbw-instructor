import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import persistState from 'redux-localstorage'
import _ from 'lodash'
import {stampNewMission} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission'
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

  // if (__DEV__) {
    // copy state to local storage
    enhancers.push(persistState(null, {
      slicer: paths => state => {
        if (state && state.login && state.login.isLoggedIn) {
          let subset = {
            course: state.course,
            result: _.omit(state.result, [
              // 'isGetResultsInProgress', 'isGetStudentResultInProgress', 'resultsByMission'
              'isGetResultsInProgress', 'isGetStudentResultInProgress',
            ]),
            editMission: _.assign({}, state.editMission, {
              newMission: stampNewMission(),
              outcomeQuery: '',
              selectedModule: null,
              isCreateMissionInProgress: false,
              isCreateMissionsInProgress: false,
              isDeleteMissionInProgress: false
            }),
            mapping: _.omit(state.mapping, ['currentEntity']),
            mission: _.assign({}, state.mission, {
              currentTarget: null,
              isGetMissionInProgress: false,
              isGetMissionsInProgress: false
            }),
            login: state.login,
            location: state.location,
            view: _.assign({}, state.view, {
              name: 'dashboard.resultsView'
            })
          };

          return subset;
        }
        // console.log('storing state:', subset)

        return {};
      }
    }))
  // }


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
