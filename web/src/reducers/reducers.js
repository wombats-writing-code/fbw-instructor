import { combineReducers } from 'redux'
import locationReducer from './location'

import viewReducer from './view'
// import analysisReducer from './analysis'

import missionReducer from './Mission/Mission'
import mappingReducer from './Mapping/Mapping'
import bankReducer from './Bank/Bank'
import userReducer from './User/User'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    view: viewReducer,
    // analysis: analysisReducer,
    mission: missionReducer,
    mapping: mappingReducer,
    bank: bankReducer,
    user: userReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
