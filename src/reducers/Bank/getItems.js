
import 'lodash'
let Q = require('q')

import {getDomain} from '../common'

// ----
// Action types
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const GET_ITEMS = 'GET_ITEMS'
// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveItems(banks) {
  return {type: RECEIVE_ITEMS, banks};
}

export function getItemsOptimistic(data) {
  return {type: GET_ITEMS, data };
}

let banks = ['assessment.Item%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU', 'assessment.Item%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU']

export function getItems(bankId) {

  return function(dispatch) {
    dispatch(getItemsOptimistic([]));

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/items`;

    return fetch(url)
    .then((res) => {
      return res.json()
    })
    .then((items) => {
      console.log('items', items);
      dispatch(receiveItems(items))
    })
    .catch((error) => {
      console.log('error getting items data', error);
    });
  }
}
