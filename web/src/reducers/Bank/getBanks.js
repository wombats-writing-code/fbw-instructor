
import 'lodash'
let Q = require('q')

require('es6-promise').polyfill();
require('isomorphic-fetch');

import {getDomain} from '../common'

// ----
// Action types
export const RECEIVE_BANKS = 'RECEIVE_BANKS'
export const GET_BANKS = 'GET_BANKS'
// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveBanks(banks) {
  return {type: RECEIVE_BANKS, banks};
}

// optimistic action creator - this won't be called directly
// by the React components, but from our async thunk function
export function getBanksOptimistic(data) {
  return {type: GET_BANKS, data };
}

// returns a list of FbW Banks for the school
// TODO:
// This should eventually tie into the LMS
//    bankId: 'assessment.Bank%3A576d6d3271e4828c441d721a' + '@bazzim.MIT.EDU'
//    bankId: 'assessment.Bank:57d70ed471e482a74879349a' + '@bazzim.MIT.EDU',

let banks = ['assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU', 'assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU']

export function getBanks() {

  // console.log('getBanks');

  return function(dispatch) {
    dispatch(getBanksOptimistic([]));

    let promises = [];
    _.each(banks, (bank) => {
      let url = getDomain(location.host) + `/middleman/banks/${bank}`;
      promises.push(fetch(url))
    })

    return Q.all(promises)
    .then((responses) => {
      let data = []
      _.each(responses, (res) => {
        data.push(res.json())
      })
      return Q.all(data)
    })
    .then((data) => {
      let banks = []
      _.each(data, (bank) => {
        banks.push(bank)
      })
      dispatch(receiveBanks(banks))
    })
    .catch((error) => {
      console.log('error getting banks data', error);
    });
  }
}
