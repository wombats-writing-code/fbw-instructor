
import 'lodash'

import {getDomain} from '../common'

// ----
// Action types
export const RECEIVE_MISSIONS = 'RECEIVE_MISSIONS'
export const GET_MISSIONS = 'GET_MISSIONS'
// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveMissions(missions) {
  return {type: RECEIVE_MISSIONS, missions};
}

// optimistic action creator - this won't be called directly
// by the React components, but from our async thunk function
export function getMissionsOptimistic(data) {
  return {type: GET_MISSIONS, data };
}

// returns a list of Mission offereds
export function getMissions(bankId) {

  console.log('getMissions of', bankId);

  return function(dispatch) {
    dispatch(getMissionsOptimistic([]));

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/missions`;

    let missions;
    return fetch(url)
    .then((res) => res.json())
    .then((missions) => {
      console.log('received getting missions', missions);

      dispatch(receiveMissions(missions));
    })
    .catch((error) => {
      console.log('error getting missions data', error);
    });
  }
}
