
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
export const RECEIVE_CREATE_TEST_FLIGHT_MISSIONS = 'RECEIVE_CREATE_TEST_FLIGHT_MISSIONS'

// @Cole:
// can't be bothered to do the optimistic part, so we'll just wait for the server to give us a response,
// and in the then block it'll dispatch this action,
// and then the reducer will handle it and modify state as needed
export function receiveCreateTestFlightMissions(missions) {
  return {type: RECEIVE_CREATE_TEST_FLIGHT_MISSIONS, missions };
}


export function createTestFlightMissionsOptimistic(missions) {
   return {type: createTestFlightMissions, missions };
}

// this is the actual async createTestFlightMissions function that calls qbank
export function createTestFlightMissions(data, bankId) {
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
    dispatch(createTestFlightMissionsOptimistic([]));

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/personalmissions`;
    return fetch(url, params)
    .then((missions) => {
      console.log('created test flight missions', missions);

      dispatch(receiveCreateTestFlightMissions(missions));
    })
    .catch((error) => {
      console.log('error creating test flight missions', error);
    });
  }
}
