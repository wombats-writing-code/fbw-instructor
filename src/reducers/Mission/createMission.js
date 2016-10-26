// assessment store

import 'lodash'

var Q = require('q');

// ------------------------------------
// Actions
// ------------------------------------

export const CREATE_MISSION = 'CREATE_MISSION'

// optimistic action creator - this won't be called directly
// by the React components, but from our async thunk function
export function createMissionOptimistic(mission) {
  return {type: CREATE_MISSION, mission };
}

// this is the actual async createMission function that calls qbank
export function createMission(data, bankId) {
  let currentBankId = '';

  let params = {
      data: data,
      method: 'POST',
      path: `assessment/banks/${bankId}/assessments`
  };

  return function(dispatch) {
    // here starts the code that actually gets executed when the
    // createMission action creator is dispatched

    dispatch(createMissionOptimistic(data));

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
