
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

//
// export function createMissionOptimistic(mission) {
//   return {type: CREATE_MISSION, mission };
// }

// this is the actual async createMission function that calls qbank
export function createMission(data, bankId) {
  let params = {
    body: JSON.stringify({
      name: data.displayName,
      genusTypeId: data.genusTypeId,
      startTime: momentToQBank(data.startTime),
      deadline: momentToQBank(data.deadline)
    }),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  };

  return function(dispatch) {
    // here starts the code that actually gets executed when the
    // createMission action creator is dispatched
    // take the data in the "newMission" form in state, and send that to the server

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/missions`;

    return fetch(url, params)
    .then((res) => res.json())
    .then((mission) => {
      console.log('created mission', mission);

      dispatch(receiveCreateMission(mission));
    })
    .catch((error) => {
      console.log('error creating mission', error);
    });


    // dispatch(createMissionOptimistic(data));     // let's not worry about the optimistic part for now

    // return qbankFetch(params)
    // .then((res) => {
    //   return res.json();
    // })
    // .then((assessmentData) => {
    //   let offeredParams = {
    //       data: data,
    //       method: 'POST',
    //       path: `assessment/banks/${currentBankId}/assessments/${assessmentData.id}/assessmentsoffered`
    //     };
    //
    //   newMission = assessmentData;
    //
    //   // set the Offered params for when solutions can be reviewed
    //   offeredParams.data['reviewOptions'] = {
    //     solution: {
    //       duringAttempt: true,
    //       afterAttempt: true,
    //       beforeDeadline: true,
    //       afterDeadline: true
    //     },
    //     whetherCorrect: {
    //       duringAttempt: true,
    //       afterAttempt: true,
    //       beforeDeadline: true,
    //       afterDeadline: true
    //     }
    //   };
    //
    //   return qbankFetch(offeredParams);
    // })
    // .then((res) => {
    //   return res.json();
    // })
    // .then((offeredData) => {
    //   let mashUp = {};
    //   mashUp.startTime = offeredData.startTime;
    //   mashUp.deadline = offeredData.deadline;
    //   mashUp.assessmentOfferedId = offeredData.id;
    //
    // })
    // .catch((error) => {
    //   console.log('error creating an assessment + offered');
    // })
    // .done();
  }
}
