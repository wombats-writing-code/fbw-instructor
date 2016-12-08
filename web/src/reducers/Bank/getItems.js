
import 'lodash'
import axios from 'axios'

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

    let url = `${getDomain()}/middleman/banks/${bankId}/items`;

    return axios(url)
    .then((response) => {
      // console.log('items', items);
      dispatch(receiveItems(response.data))
    })
    .catch((error) => {
      console.log('error getting items data', error);
    });
  }
}
