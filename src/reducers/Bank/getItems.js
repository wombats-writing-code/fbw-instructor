
import 'lodash'
let Q = require('q')

require('es6-promise').polyfill();
require('isomorphic-fetch');

import {getDomain} from '../common'

// ----
// Action types
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const GET_ITEMS = 'GET_ITEMS'
// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveItems(items) {
  return {type: RECEIVE_ITEMS, items};
}

export function getItemsOptimistic(data) {
  return {type: GET_ITEMS, data };
}

export function getItems(bankId) {

  return function(dispatch) {
    dispatch(getItemsOptimistic([]));

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/items`;

    return fetch(url)
    .then((res) => {
      return res.json()
    })
    .then((items) => {
      // console.log('items', items);
      dispatch(receiveItems(items))
    })
    .catch((error) => {
      console.log('error getting items data', error);
    });
  }
}
