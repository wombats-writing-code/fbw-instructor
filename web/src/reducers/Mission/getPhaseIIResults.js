// Phase II results (for all students)
import axios from 'axios'

import {getDomain} from '../common'

// ------------------------------------
// Actions
// ------------------------------------

export const GET_PHASE_II_RESULTS_OPTIMISTIC = 'GET_PHASE_II_RESULTS_OPTIMISTIC'
export const RECEIVE_PHASE_II_RESULTS = 'RECEIVE_PHASE_II_RESULTS'

export function receivePhaseIIResults(results) {
  return {type: RECEIVE_PHASE_II_RESULTS, results};
}

export function getPhaseIIResultsOptimistic(results) {
  return {type: GET_PHASE_II_RESULTS_OPTIMISTIC, results };
}

export function getPhaseIIResults(mission, bankId) {
  // to get results of the Phase II missions
  // pass in the original mission ID, the middleman
  // handles the intervening steps.
  // Use separate bankId param because can't
  //   use the mission.assignedBankIds[0] bank -- that is the shared bank
  //   but we need to find Phase II missions in the private banks, so
  //   rely on hierarchy of the selected "class" bank (i.e. Accounting)

  return function(dispatch) {
    dispatch(getPhaseIIResultsOptimistic(null));

    if (!mission) return;

    let url = `${getDomain(location.host)}/middleman/banks/${bankId}/offereds/${mission.assessmentOfferedId}/p2results`;

    return axios(url)
    .then( (results) => {
      // console.log('got phase 2 results', results.data);

      dispatch(receivePhaseIIResults(results.data));
    })
    .catch((error) => {
      console.log('error getting all phase 2 mission results');
    })
  }

}
