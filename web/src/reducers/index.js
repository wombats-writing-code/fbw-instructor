import { combineReducers } from 'redux'

import locationReducer from './location'
import viewReducer from './view'

import commonReducers from '@wombats-writing-code/fbw-platform-common/reducers'


export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...commonReducers,
    location: locationReducer,
    view: viewReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
