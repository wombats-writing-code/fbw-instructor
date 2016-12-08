// bank reducer

import thunk from 'redux-thunk';
import 'lodash'

import {RECEIVE_BANKS} from './getBanks'
import {SELECT_BANK} from './selectBank'
import {RECEIVE_SET_BANKS} from './setBanks'

import {RECEIVE_ITEMS} from './getItems'

// ------------------------------------
// Reducer
// ------------------------------------
const VISITOR_BANKS = ['assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU',
  'assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU']

const initialState = {
  enrolledBankIds: VISITOR_BANKS
}
export default function bankReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_BANKS:
      return _.assign({}, state, {
        banks: action.banks
      });

    case RECEIVE_SET_BANKS:
      return _.assign({}, state, {
        enrolledBankIds: action.bankIds ? action.bankIds : VISITOR_BANKS
      })

    case SELECT_BANK:
      return _.assign({}, state, {
        currentBank: action.bank
      });

    case RECEIVE_ITEMS:
      return _.assign({}, state, {
        items: action.items
      });

    default:
      return state
  }
}
