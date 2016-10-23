
import 'lodash'

var Q = require('q');

import credentials from '../../credentials/credentials';
let qbankFetch = require('fbw-utils')(credentials).qbankFetch;

// ----
// Action types
export const RECEIVE_ASSESSMENTS = 'RECEIVE_ASSESSMENTS'
export const GET_ASSESSMENTS = 'GET_ASSESSMENTS'
// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveAssessments(missions) {
  return {type: RECEIVE_ASSESSMENTS, missions};
}

// optimistic action creator - this won't be called directly
// by the React components, but from our async thunk function
export function getAssessmentsOptimistic(data) {
  return {type: GET_ASSESSMENTS, data };
}

// returns a list of assessment offereds
export function getAssessments(bankId) {

  console.log('getAssessments of', bankId);
  console.log('credentials', credentials)

  return function(dispatch) {
    dispatch(getAssessmentsOptimistic([]));

    let params = {
      path: `assessment/banks/${bankId}/assessments?sections&page=all`
    };

    let assessments;
    return qbankFetch(params)
    .then((res) => res.json())
    .then((data) => {
      console.log('received', data);

      if (data !== null) {
        assessments = data.data.results;

        if (assessments.length !== 0) {
          let offeredPromises = _.map(assessments, (assessment) => {
            return qbankFetch({path: `assessment/banks/${bankId}/assessments/${assessment.id}/assessmentsoffered?page=all`});
          });

          return Q.all(offeredPromises);

        } else {
          return Q.reject('done');
        }
      }

      return [];
    })
    .then((res) => {
      let offeredJson = _.map(res, (offered) => offered.json())
      return Q.all(offeredJson);
    })
    .then((data) => {
      let missions = _.map(assessments, (assessment, idx) => {
        return _.assign({}, assessment, {
          startTime: data[index].data.results[0].startTime,
          deadline: data[index].data.results[0].deadline,
          assessmentOfferedId: data[index].data.results[0].id
        })
      });

      dispatch(receiveAssessments(missions));
    })
    .catch((error) => {
      console.log('error getting assessments + offered data', error);
    })
    .done();
  }
}
