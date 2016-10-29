// bank reducer

import thunk from 'redux-thunk';
import 'lodash'

import {RECEIVE_BANKS} from './getBanks'
import {SELECT_BANK} from './selectBank'


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function bankReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_BANKS:
      return _.assign({}, state, {
        banks: action.banks
      });

    case SELECT_BANK:
      return _.assign({}, state, {
        currentBank: action.bank
      });

    default:
      return state
  }
}
