// outcome reducer, so we can translate directive learningObjectiveId to text
import _ from 'lodash'

import { GET_OUTCOMES_OPTIMISTIC, RECEIVE_OUTCOMES } from './getOutcomes'
import { RECEIVE_GET_SAVED_OUTCOMES } from './getSavedOutcomes'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function outcomeReducer (state = initialState, action) {
  switch (action.type) {
    case GET_OUTCOMES_OPTIMISTIC:
      return _.assign({}, state, {
        isGetOutcomesInProgress: true
      })

    case RECEIVE_OUTCOMES:
    case RECEIVE_GET_SAVED_OUTCOMES:
      return _.assign({}, state, {
        outcomes: action.outcomes,
        isGetOutcomesInProgress: false
      })

    default:
      return state
  }
}
