
import 'lodash'
import axios from 'axios'

import {
  getDomain,
  momentToQBank,
  convertPythonDateToJS,
  afterMidnight,
  beforeMidnight,
  LO_SCAFFOLD_MISSION_GENUS_TYPE,
  PHASE_I_MISSION_RECORD_TYPE
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
// Note that this creates a Phase I mission -- NOT the Phase II missions
// Note that this requires the Term BankID, NOT the sharedBankId (that
//   is calculated by the web middleman)
export function createMission(data, bankId, directivesItemsMap, itemBankId) {
  return function(dispatch) {
    // here starts the code that actually gets executed when the
    // createMission action creator is dispatched
    // take the data in the "newMission" form in state, and send that to the server
    let missionParams = {
      displayName: data.displayName,
      genusTypeId: data.genusTypeId,
      startTime: afterMidnight(momentToQBank(data.startTime)),
      deadline: beforeMidnight(momentToQBank(data.deadline)),
      recordTypeIds: [PHASE_I_MISSION_RECORD_TYPE],
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
    options = {
      data: missionParams,
      method: 'POST',
      url: `${getDomain()}/middleman/banks/${bankId}/missions`
    }
    console.log(missionParams)
    let optimisticParams = _.assign({}, missionParams)
    optimisticParams.startTime = convertPythonDateToJS(missionParams.startTime)
    optimisticParams.deadline = convertPythonDateToJS(missionParams.deadline)
    dispatch(createMissionOptimistic(optimisticParams));

    return axios(options)
    .then((response) => {
      console.log('created mission', response.data);

      dispatch(receiveCreateMission(response.data));
    })
    .catch((error) => {
      console.log('error creating mission', error);
    });
  }
}
