
import 'lodash'
let Q = require('q')
let moment = require('moment')

require('es6-promise').polyfill();
require('isomorphic-fetch');

import {
  getDomain,
  momentToQBank,
  afterMidnight,
  beforeMidnight,
  LO_SCAFFOLD_MISSION_GENUS_TYPE,
  TEST_FLIGHT_MISSION,
  PHASE_II_MISSION_RECORD_TYPE
} from '../common'

// ------------------------------------
// Actions
// ------------------------------------

export const CREATE_TEST_FLIGHT_MISSIONS = 'CREATE_TEST_FLIGHT_MISSIONS'
export const CREATE_TEST_FLIGHT_MISSIONS_OPTIMISTIC = 'CREATE_TEST_FLIGHT_MISSIONS_OPTIMISTIC'

export const RECEIVE_CREATE_TEST_FLIGHT_MISSIONS = 'RECEIVE_CREATE_TEST_FLIGHT_MISSIONS'

export function receiveCreateTestFlightMissions(missions, originalMission) {
  return {type: RECEIVE_CREATE_TEST_FLIGHT_MISSIONS, missions, originalMission };
}


export function createTestFlightMissionsOptimistic(missions, originalMission) {
   return {type: CREATE_TEST_FLIGHT_MISSIONS_OPTIMISTIC, missions, originalMission };
}

// this is the actual async createTestFlightMissions function that calls qbank
// This creates Phase II missions and then sets the originating
// Phase I mission as already spawned
export function createTestFlightMissions(data, bankId, originalMission, spawnDate) {
  let testFlightParameters = []
  _.each(data, function (student) {
    let studentParams = {
      username: student.agentId,
      name: student.nextMission.name,
      genusTypeId: TEST_FLIGHT_MISSION,
      recordTypeIds: [PHASE_II_MISSION_RECORD_TYPE],
      sourceAssessmentTakenId: student.takenId,
      sections: _.map(student.nextMission.directives, function (directive) {
        directive.type = LO_SCAFFOLD_MISSION_GENUS_TYPE
        return directive
      }),
      startTime: afterMidnight(momentToQBank(spawnDate)),
      deadline: beforeMidnight(momentToQBank(spawnDate))
    }
    testFlightParameters.push(studentParams)
  })
  console.log(testFlightParameters)
  let params = {
      body: JSON.stringify(testFlightParameters),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    };
  return function(dispatch) {
    let phaseIIMissions = []
    // here starts the code that actually gets executed when the
    // createMission action creator is dispatched
    // take the data in the "newMission" form in state, and send that to the server
    dispatch(createTestFlightMissionsOptimistic([], originalMission));

    // dummy for UI mock
    // return setTimeout( () => {
    //   let missions = [];
    //   dispatch(receiveCreateTestFlightMissions(missions, originalMission));
    // }, 7000);

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/personalmissions`;
    return fetch(url, params)
    .then((res) => {
      return res.json();
    })
    .then((missions) => {
      phaseIIMissions = missions
      // now let's mark the original Phase I as already spawned
      let updateUrl = getDomain(location.host) + `/middleman/banks/${bankId}/missions/${originalMission.id}`,
        updateParams = {
          method: 'PUT',
          body: JSON.stringify({
            hasSpawnedFollowOnPhase: true,
            assessmentOfferedId: originalMission.assessmentOfferedId  // not actually used, but need it to not break the middleman
          }),
          headers: {
            'content-type': 'application/json'
          }
        }

      return fetch(updateUrl, updateParams)
    })
    .then((res) => {
      return res.json()
    })
    .then((results) => {
      console.log('created test flight missions', phaseIIMissions);
      originalMission.hasSpawnedFollowOnPhase = true;
      dispatch(receiveCreateTestFlightMissions(phaseIIMissions, originalMission));
    })
    .catch((error) => {
      console.log('error creating test flight missions', error);
    });
  }
}
