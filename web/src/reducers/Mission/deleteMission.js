import thunk from 'redux-thunk';
import 'lodash'
import axios from 'axios'

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
  let options = {
    data: {
      assessmentOfferedId: mission.assessmentOfferedId
    },
    method: 'DELETE',
    url: `${getDomain()}/middleman/banks/${mission.bankId}/missions/${mission.id}`
  }

  return function(dispatch) {
    //dispatch(deleteMissionOptimistic(data));

    return axios(options)
    .then((results) => {
      console.log('deleted mission', mission);

      dispatch(receiveDeleteMission(mission));
    })
    .catch((error) => {
      console.log('error deleting mission', error);
    });
  }
}
