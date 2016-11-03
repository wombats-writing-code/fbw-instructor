
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

export function getResultsAll(missions) {

  return function(dispatch) {
    dispatch(getResultsOptimistic(null));

    if (!missions) return;
    console.log('will getResultsAll of', missions);

    let getResultsPromises = _.map(missions, fetchResult);

    return Q.all(getResultsPromises)
    .then( (res) => {
      let allResults = _.flatten(res);
      console.log('got results all', allResults);

      dispatch(receiveResultsAll(allResults));

      return allResults;
    });
  }

}
