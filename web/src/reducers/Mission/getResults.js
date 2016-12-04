
import 'lodash'
let Q = require('q')

import {getDomain} from '../common'

// mission.assessmentOfferedId

// ------------------------------------
// Actions
// ------------------------------------

export const GET_RESULTS = 'GET_RESULTS'
export const GET_RESULTS_OPTIMISTIC = 'GET_RESULTS_OPTIMISTIC'
export const RECEIVE_RESULTS = 'RECEIVE_RESULTS'

export function receiveResults(results) {
  return {type: RECEIVE_RESULTS, results};
}

export function receiveResultsAll(results) {
  return {type: RECEIVE_RESULTS, results};
}

export function getResultsOptimistic(results) {
  return {type: GET_RESULTS_OPTIMISTIC, results };
}


const fetchResult = (mission) => {
  let url = getDomain(location.host) + `/middleman/banks/${mission.assignedBankIds[0]}/offereds/${mission.assessmentOfferedId}/results`;

  return fetch(url)
  .then((res) => res.json());
}

// this is the actual async create function that calls qbank
export function getResults(mission) {

  return function(dispatch) {
    dispatch(getResultsOptimistic());

    let url = getDomain(location.host) + `/middleman/banks/${mission.assignedBankIds[0]}/offereds/${mission.assessmentOfferedId}/results`;

    fetchResult(mission)
    .then((resultsData) => {
      console.log('received getResults', resultsData)
      dispatch(receiveResults(resultsData));
    })
    .catch((error) => {
      console.log('error getting mission results');
    })
  }
}

export function getResultsAll(mission, bankId) {
  // to get results of the Phase II missions
  // pass in the original mission ID, the middleman
  // handles the intervening steps.
  // Use separate bankId param because can't
  //   use the mission.assignedBankIds[0] bank -- that is the shared bank
  //   but we need to find Phase II missions in the private banks, so
  //   rely on hierarchy of the selected "class" bank (i.e. Accounting)

  return function(dispatch) {
    dispatch(getResultsOptimistic(null));

    if (!mission) return;
    // console.log('will getResultsAll of', mission);

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/offereds/${mission.assessmentOfferedId}/p2results`;

    return fetch(url)
    .then((res) => {return res.json()})
    .then( (results) => {
      // console.log('got results all', results);

      dispatch(receiveResultsAll(results));
    })
    .catch((error) => {
      console.log('error getting all phase 2 mission results');
    })
  }

}
