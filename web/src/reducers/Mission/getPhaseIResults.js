//. Phase I results
import axios from 'axios'

import {getDomain} from '../common'

// ------------------------------------
// Actions
// ------------------------------------

export const GET_PHASE_I_RESULTS_OPTIMISTIC = 'GET_PHASE_I_RESULTS_OPTIMISTIC'
export const RECEIVE_PHASE_I_RESULTS = 'RECEIVE_PHASE_I_RESULTS'

export function receivePhaseIResults(results) {
  return {type: RECEIVE_PHASE_I_RESULTS, results};
}

export function getPhaseIResultsOptimistic(results) {
  return {type: GET_PHASE_I_RESULTS_OPTIMISTIC, results };
}

// this is the actual async create function that calls qbank
export function getPhaseIResults(mission, bankId) {
  // use the subjectBankId here instead of the mission.assignedBankIds[0]
  //   for performance reasons. The sharedBankId is slow, because it has
  //   lots of parent banks to check for authz

  return function(dispatch) {
    dispatch(getPhaseIResultsOptimistic());

    let url = `${getDomain()}/middleman/banks/${bankId}/offereds/${mission.assessmentOfferedId}/results`;

    axios.get(url)
    .then((results) => {
      console.log('received phase I results', results.data)
      dispatch(receivePhaseIResults(results.data));
    })
    .catch((error) => {
      console.log('error getting phase I mission results', error);
    })
  }
}
