
import 'lodash'
import axios from 'axios'

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

export function getBanks(bankIds) {

  // console.log('getBanks');

  return function(dispatch) {
    dispatch(getBanksOptimistic([]));

    let promises = [];
    console.log('getting banks', bankIds)
    _.each(bankIds, (bankId) => {
      let options = {
        url: `${getDomain()}/middleman/banks/${bankId}`
      }
      console.log(options)
      promises.push(axios(options))
    })

    return axios.all(promises)
    .then((responses) => {
      console.log('got bank responses', responses)
      let banks = []
      _.each(responses, (response) => {
        banks.push(response.data)
      })
      dispatch(receiveBanks(banks))
    })
    .catch((error) => {
      console.log('error getting banks data', error);
    });
  }
}
