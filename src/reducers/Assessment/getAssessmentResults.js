
import 'lodash'

var Q = require('q');

let credentials = require('../credentials/credentials');
var qbankFetch = require('fbw-utils')(credentials).qbankFetch;

// ------------------------------------
// Actions
// ------------------------------------

// optimistic action creator - this won't be called directly
// by the React components, but from our async thunk function
export function getAssessmentResultsOptimistic(data) {
  return {type: GET_ASSESSMENT_RESULTS, data };
}

// this is the actual async createAssessment function that calls qbank
export function getAssessmentResults(data, bankId) {

  return function(dispatch) {
    dispatch(getAssessmentResultsOptimistic(data));

    return qbankFetch(params);
    .then((res) => {
      return res.json();
    })
    .then((resultsData) => {
      data.callback(resultsData.data.results);
    })
    .catch((error) => {
      console.log('error getting assessment results');
    })
    .done();
  }
}
