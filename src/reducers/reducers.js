import { combineReducers } from 'redux'
import locationReducer from './location'

import viewReducer from './view'
import missionReducer from './Mission/Mission'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    view: viewReducer,
    mission: missionReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
