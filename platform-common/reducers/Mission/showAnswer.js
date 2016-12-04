
import _ from 'lodash'
import axios from 'axios'

import { getDomain, convertImagePaths } from '../../utilities'

// ----
// Action types
export const SHOW_ANSWER_OPTIMISTIC = 'SHOW_ANSWER_OPTIMISTIC'
export const RECEIVE_SHOW_ANSWER = 'RECEIVE_SHOW_ANSWER'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveShowAnswer(response) {
  return {type: RECEIVE_SHOW_ANSWER, response};
}

export function showAnswerOptimistic(data) {
  return {type: SHOW_ANSWER_OPTIMISTIC, data };
}

export function showAnswer(data) {

  return function(dispatch) {
    dispatch(showAnswerOptimistic());

    let options = {
      url: `${getDomain()}/middleman/banks/${data.section.assignedBankIds[0]}/takens/${data.section.id}/questions/${data.questionId}/surrender`,
      method: 'POST',
      headers: {
        'x-fbw-username': data.username
      }
    }

    return axios(options)
    .then((results) => {
      // update the response here with questionId, so we can
      // find it when updating the state
      let response = results.data
      response.showAnswer = true  // to not turn the target icon yellow in targetCarousel
      response.questionId = data.questionId
      response.choiceIds = [data.choiceId]
      return convertImagePaths(response)
    })
    .then((convertedResponse) => {
      console.log(convertedResponse)
      dispatch(receiveShowAnswer(convertedResponse));
    })
    .catch((error) => {
      console.log('error submitting show answer', error);
    });
  }
}
