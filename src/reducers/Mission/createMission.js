
import 'lodash'

import {
  getDomain,
  momentToQBank,
  afterMidnight,
  beforeMidnight,
  LO_SCAFFOLD_MISSION_GENUS_TYPE
} from '../common'

// ------------------------------------
// Actions
// ------------------------------------

export const CREATE_MISSION = 'CREATE_MISSION'
export const RECEIVE_CREATE_MISSION = 'RECEIVE_CREATE_MISSION'
export const CREATE_MISSION_OPTIMISTIC = 'CREATE_MISSION_OPTIMISTIC'

// @Cole:
// can't be bothered to do the optimistic part, so we'll just wait for the server to give us a response,
// and in the then block it'll dispatch this action,
// and then the reducer will handle it and modify state as needed
export function receiveCreateMission(mission) {
  return {type: RECEIVE_CREATE_MISSION, mission };
}


export function createMissionOptimistic(mission) {
   return {type: CREATE_MISSION_OPTIMISTIC, mission };
}

// this is the actual async createMission function that calls qbank
export function createMission(data, bankId, directivesItemsMap, itemBankId) {
  let missionParams = {
        displayName: data.displayName,
        genusTypeId: data.genusTypeId,
        startTime: afterMidnight(momentToQBank(data.startTime)),
        deadline: beforeMidnight(momentToQBank(data.deadline)),
        sections: _.map(data.selectedDirectives, (directive) => {
          let outcomeId = directive.outcome.id,
            numItems = directivesItemsMap[outcomeId];

          return {
            type: LO_SCAFFOLD_MISSION_GENUS_TYPE,
            learningObjectiveId: outcomeId,
            quota: Math.floor(numItems / 2) || 1,
            waypointQuota: 1,
            itemBankId: itemBankId,
            minimumProficiency: (Math.floor(numItems / 4) || 1).toString()
          }
        })
      },
    fetchParams = {
      body: JSON.stringify(missionParams),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    };
    console.log(missionParams)

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
