import { combineReducers } from 'redux'
import locationReducer from './location'
import assessmentReducer from './Assessment/Assessment'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    assessment: assessmentReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
