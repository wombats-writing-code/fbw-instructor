// assessment store

import 'lodash'

var Q = require('q');

let credentials = require('../../credentials/credentials');
var qbankFetch = require('fbw-utils')(credentials).qbankFetch;

// ------------------------------------
// Actions
// ------------------------------------

// optimistic action creator - this won't be called directly
// by the React components, but from our async thunk function
export function createAssessmentOptimistic(data) {
  return {type: CREATE_ASSESSMENT, data };
}

// this is the actual async createAssessment function that calls qbank
export function createAssessment(data, bankId) {
  let currentBankId = '';

  let params = {
      data: data,
      method: 'POST',
      path: `assessment/banks/${bankId}/assessments`
  };

  return function(dispatch) {
    // here starts the code that actually gets executed when the
    // createAssessment action creator is dispatched

    dispatch(createAssessmentOptimistic(data));

    return qbankFetch(params)
    .then((res) => {
      return res.json();
    })
    .then((assessmentData) => {
      let offeredParams = {
          data: data,
          method: 'POST',
          path: `assessment/banks/${currentBankId}/assessments/${assessmentData.id}/assessmentsoffered`
        };

      newAssessment = assessmentData;

      // set the Offered params for when solutions can be reviewed
      offeredParams.data['reviewOptions'] = {
        solution: {
          duringAttempt: true,
          afterAttempt: true,
          beforeDeadline: true,
          afterDeadline: true
        },
        whetherCorrect: {
          duringAttempt: true,
          afterAttempt: true,
          beforeDeadline: true,
          afterDeadline: true
        }
      };

      return qbankFetch(offeredParams);
    })
    .then((res) => {
      return res.json();
    })
    .then((offeredData) => {
      let mashUp = {};
      mashUp.startTime = offeredData.startTime;
      mashUp.deadline = offeredData.deadline;
      mashUp.assessmentOfferedId = offeredData.id;

    })
    .catch((error) => {
      console.log('error creating an assessment + offered');
    })
    .done();
  }
}
