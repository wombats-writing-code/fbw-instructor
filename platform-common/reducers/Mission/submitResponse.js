
import _ from 'lodash'
import axios from 'axios'

import { getDomain, convertImagePaths } from '../../utilities'

// ----
// Action types
export const SUBMIT_RESPONSE = 'SUBMIT_RESPONSE'
export const SUBMIT_RESPONSE_OPTIMISTIC = 'SUBMIT_RESPONSE_OPTIMISTIC'
export const RECEIVE_SUBMIT_RESPONSE = 'RECEIVE_SUBMIT_RESPONSE'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSubmitResponse(response) {
  return {type: RECEIVE_SUBMIT_RESPONSE, response};
}

export function submitResponseOptimistic(data) {
  return {type: SUBMIT_RESPONSE_OPTIMISTIC, data };
}

export function submitResponse(data) {

  return function(dispatch) {
    dispatch(submitResponseOptimistic());

    let options = {
      url: `${getDomain()}/middleman/banks/${data.section.assignedBankIds[0]}/takens/${data.section.id}/questions/${data.questionId}/submit`,
      method: 'POST',
      data: {
        choiceIds: [data.choiceId],
        type: 'answer-record-type%3Amulti-choice-with-files-and-feedback%40ODL.MIT.EDU'
      },
      headers: {
        'x-fbw-username': data.username
      }
    }

    return axios(options)
    .then((results) => {
      // update the response here with questionId, so we can
      // find it when updating the state
      let response = results.data
      response.questionId = data.questionId
      response.choiceIds = [data.choiceId]
      return convertImagePaths(response)
    })
    .then((convertedResponse) => {
      dispatch(receiveSubmitResponse(convertedResponse));
    })
    .catch((error) => {
      console.log('error submitting response', error);
    });
  }
}
