
import _ from 'lodash'
import axios from 'axios'

import { save } from '../../utilities'

// ----
// Action types
export const RECEIVE_SET_ENROLLED_SUBJECTS = 'RECEIVE_SET_ENROLLED_SUBJECTS'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSetEnrolledSubjects (bankIds) {
  return { type: RECEIVE_SET_ENROLLED_SUBJECTS, bankIds }
}

// sets the enrolled (d2l) bankIds in the global state / local storage
export function setEnrolledSubjects (bankIds) {
  return function (dispatch) {
    save('enrolledBankIds', bankIds)
    dispatch(receiveSetEnrolledSubjects(bankIds))
  }
}
