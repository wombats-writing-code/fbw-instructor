
import 'lodash'
let Q = require('q')
let moment = require('moment')

import {
  getDomain,
  momentToQBank,
  afterMidnight,
  beforeMidnight,
  LO_SCAFFOLD_MISSION_GENUS_TYPE,
  TEST_FLIGHT_MISSION
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
export function createTestFlightMissions(data, bankId, originalMission) {
  // TODO: for demo purposes, we'll seat the TestFlight deadlines
  // to now(), but need to change that somehow
  let testFlightParameters = []
  _.each(data, function (student) {
    let now = moment.utc(),
      studentParams = {
      username: student.name + '@acc.edu', // TODO this is bad -- how do we clean this up??
      name: student.nextMission.name,
      genusTypeId: TEST_FLIGHT_MISSION,
      sections: _.map(student.nextMission.directives, function (directive) {
        directive.type = LO_SCAFFOLD_MISSION_GENUS_TYPE
        return directive
      }),
      startTime: afterMidnight(momentToQBank(now)),
      deadline: beforeMidnight(momentToQBank(now))
    }
    testFlightParameters.push(studentParams)
  })
  let params = {
      body: JSON.stringify(testFlightParameters),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    };
  return function(dispatch) {
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
      console.log('created test flight missions', missions);
      dispatch(receiveCreateTestFlightMissions(missions, originalMission));
    })
    .catch((error) => {
      console.log('error creating test flight missions', error);
    });
  }
}
