// assessment reducer

import thunk from 'redux-thunk';
import 'lodash'

import {RECEIVE_ASSESSMENTS, getAssessments, getAssessmentsOptimistic} from './getAssessments'

import {createAssessment, createAssessmentOptimistic} from './createAssessment'
import {updateAssessment, updateAssessmentOptimistic} from './updateAssessment'
import {deleteAssessment, deleteAssessmentOptimistic} from './deleteAssessment'

import {createAssessmentPart, createAssessmentPartOptimistic} from './createAssessmentPart'
import {updateAssessmentPart, updateAssessmentPartOptimistic} from './updateAssessmentPart'
import {deleteAssessmentPart, deleteAssessmentPartOptimistic} from './deleteAssessmentPart'

import {updateAssessmentOffered, updateAssessmentOfferedOptimistic} from './updateAssessmentOffered'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function assessmentReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ASSESSMENTS:
      return action.missions

    // case GET_ASSESSMENT:
    //   return _.find(state.assessments, {id: action.assessmentId});
    //
    // case GET_ASSESSMENTS:
    //   return getAssessments(action.data)
    //
    // case CREATE_ASSESSMENT:
    //   return createAssessment(action.data)
    //
    // case UPDATE_ASSESSMENT:
    //   return updateAssessment(action.data)
    //
    // case DELETE_ASSESSMENT:
    //   return deleteAssessment(action.data)
    //
    // case CREATE_ASSESSMENT_PART:
    //   return createAssessmentPart(action.data)
    //
    // case UPDATE_ASSESSMENT_PART:
    //   return updateAssessmentPart(action.data)
    //
    // case DELETE_ASSESSMENT_PART:
    //   return deleteAssessment(action.data)
    //
    // case UPDATE_ASSESSMENT_OFFERED:
    //   return updateAssessmentOffered(action.data)

    default:
      return state
  }
}
