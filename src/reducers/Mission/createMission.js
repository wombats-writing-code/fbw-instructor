
import 'lodash'

import {getDomain, momentToQBank} from '../common'

// ------------------------------------
// Actions
// ------------------------------------

export const CREATE_MISSION = 'CREATE_MISSION'
export const RECEIVE_CREATE_MISSION = 'RECEIVE_CREATE_MISSION'

// @Cole:
// can't be bothered to do the optimistic part, so we'll just wait for the server to give us a response,
// and in the then block it'll dispatch this action,
// and then the reducer will handle it and modify state as needed
export function receiveCreateMission(mission) {
  return {type: RECEIVE_CREATE_MISSION, mission };
}


export function createMissionOptimistic(mission) {
   return {type: CREATE_MISSION, mission };
}

// this is the actual async createMission function that calls qbank
export function createMission(data, bankId) {
  let missionParams = {
        displayName: data.displayName,
        genusTypeId: data.genusTypeId,
        startTime: momentToQBank(data.startTime),
        deadline: momentToQBank(data.deadline)
      },
    fetchParams = {
      body: JSON.stringify(missionParams),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    };

  return function(dispatch) {
    // here starts the code that actually gets executed when the
    // createMission action creator is dispatched
    // take the data in the "newMission" form in state, and send that to the server
    dispatch(createMissionOptimistic(missionParams));

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/missions`;

    return fetch(url, fetchParams)
    .then((res) => res.json())
    .then((mission) => {
      console.log('created mission', mission);

      dispatch(receiveCreateMission(mission));
    })
    .catch((error) => {
      console.log('error creating mission', error);
    });
  }
}
