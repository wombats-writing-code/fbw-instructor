
import 'lodash'
import axios from 'axios'

import {getDomain, convertPythonDateToJS} from '../common'

// ----
// Action types
export const RECEIVE_MISSIONS = 'RECEIVE_MISSIONS'
export const GET_MISSIONS = 'GET_MISSIONS'
export const GET_MISSIONS_OPTIMISTIC = 'GET_MISSIONS_OPTIMISTIC'

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
  return {type: GET_MISSIONS_OPTIMISTIC, data };
}

// returns a list of Mission offereds
export function getMissions(bankId) {

  console.log('getMissions of', bankId);

  return function(dispatch) {
    dispatch(getMissionsOptimistic());

    let url = `${getDomain()}/middleman/banks/${bankId}/missions`;

    let missions;
    return axios(url)
    .then(({data: missions}) => {
      console.log('received getting missions', missions);
      // JavaScript months run from 1-12, Python months run from 0-11. We need to adjust the dates here.
      missions = _.map(missions, (mission) => {
        return _.assign({}, mission, {
          startTime: convertPythonDateToJS(mission.startTime),
          deadline: convertPythonDateToJS(mission.deadline)
        })
      })

      dispatch(receiveMissions(missions));
    })
    .catch((error) => {
      console.log('error getting missions data', error);
    });
  }
}
