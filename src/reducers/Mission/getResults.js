
import 'lodash'

import {getDomain} from '../common'

// mission.assessmentOfferedId

// ------------------------------------
// Actions
// ------------------------------------

export const GET_RESULTS = 'GET_RESULTS'
export const RECEIVE_RESULTS = 'RECEIVE_RESULTS'

export function receiveResults(results) {
  return {type: RECEIVE_RESULTS, results};
}

export function getResultsOptimistic(results) {
  return {type: GET_RESULTS, results };
}

// this is the actual async create function that calls qbank
export function getResults(mission) {

  let url = getDomain(location.host) + `/middleman/banks/${mission.assignedBankIds[0]}/offereds/${mission.assessmentOfferedId}/results`;

  return function(dispatch) {
    dispatch(getResultsOptimistic([]));

    return fetch(url)
    .then((res) => res.json())
    .then((resultsData) => {
      console.log('received getResults', resultsData)
      dispatch(receiveResults(resultsData));
    })
    .catch((error) => {
      console.log('error getting mission results');
    })
  }
}
