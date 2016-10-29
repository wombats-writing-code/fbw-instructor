import { combineReducers } from 'redux'
import locationReducer from './location'

import viewReducer from './view'
import missionReducer from './Mission/Mission'
import mappingReducer from './Mapping/Mapping'

import bankReducer from './Bank/Bank'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    view: viewReducer,
    mission: missionReducer,
    mapping: mappingReducer,
    bank: bankReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
