import thunk from 'redux-thunk';
import 'lodash'

require('es6-promise').polyfill();
require('isomorphic-fetch');

var Q = require('q');

import {
  getDomain
} from '../common'

export const DELETE_MISSION = 'DELETE_MISSION'
export const RECEIVE_DELETE_MISSION = 'RECEIVE_DELETE_MISSION'
export const DELETE_MISSION_OPTIMISTIC = 'DELETE_MISSION_OPTIMISTIC'

export function receiveDeleteMission(mission) {
  return {type: RECEIVE_DELETE_MISSION, mission };
}

export function deleteMissionOptimistic(data) {
  return { type: DELETE_MISSION, data };
}

export function deleteMission(mission) {
  let fetchParams = {
    body: JSON.stringify({
      assessmentOfferedId: mission.assessmentOfferedId
    }),
    headers: {
      'content-type': 'application/json'
    },
    method: 'DELETE'
  }

  return function(dispatch) {
    //dispatch(deleteMissionOptimistic(data));

    let url = getDomain(location.host) + `/middleman/banks/${mission.bankId}/missions/${mission.id}`;

    return fetch(url, fetchParams)
    .then((results) => {
      console.log('deleted mission', mission);

      dispatch(receiveDeleteMission(mission));
    })
    .catch((error) => {
      console.log('error deleting mission', error);
    });
  }
}
