
import thunk from 'redux-thunk';
import 'lodash'

import {RECEIVE_MAPPING} from './getMapping'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  modules: null,
  outcomes: null,
  relationships: null
}

export default function mappingReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_MAPPING:
      return action.mapping

    default:
      return state
  }
}
