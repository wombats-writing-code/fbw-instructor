// subject reducer, should only be used for the hardcoded / simple login case
import _ from 'lodash'

import { GET_SUBJECTS_OPTIMISTIC, RECEIVE_SUBJECTS } from './getSubjects'
import { RECEIVE_SELECT_SUBJECT, SELECT_SUBJECT_OPTIMISTIC } from './selectSubject'
import { RECEIVE_RESET_SUBJECT_STATE } from './resetSubjectState'
import { RECEIVE_SET_ENROLLED_SUBJECTS } from './setEnrolledSubjects'
import { RECEIVE_GET_ENROLLED_SUBJECTS } from './getEnrolledSubjects'
import { RECEIVE_GET_SELECTED_SUBJECT } from './getSelectedSubject'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function subjectReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_RESET_SUBJECT_STATE:
      return {}

    case GET_SUBJECTS_OPTIMISTIC:
      return _.assign({}, state, {
        isGetSubjectsInProgress: true
      })

    case RECEIVE_SUBJECTS:
      return _.assign({}, state, {
        subjects: action.subjects,
        isGetSubjectsInProgress: false
      })

    case RECEIVE_SELECT_SUBJECT:
    case RECEIVE_GET_SELECTED_SUBJECT:
      return _.assign({}, state, {
        privateBankId: action.privateBankId,
      })

    case SELECT_SUBJECT_OPTIMISTIC:
      return _.assign({}, state, {
        currentSubjectBankId: action.bankId,
      })

    case RECEIVE_SET_ENROLLED_SUBJECTS:
      return _.assign({}, state, {
        enrolledBankIds: action.bankIds ? action.bankIds : ['assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU',
          'assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU']
      })

    case RECEIVE_GET_ENROLLED_SUBJECTS:
      return _.assign({}, state, {
        enrolledBankIds: action.bankIds ? action.bankIds : ['assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU',
          'assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU']
      })

    default:
      return state
  }
}
