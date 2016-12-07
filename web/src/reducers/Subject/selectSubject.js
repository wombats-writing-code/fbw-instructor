import axios from 'axios'
import moment from 'moment'

import {
  getDomain,
  momentToQBank,
  save,
  STUDENT_AUTHORIZATION_FUNCTIONS
} from '../../utilities'
// ----
// Action types
export const RECEIVE_SELECT_SUBJECT = 'RECEIVE_SELECT_SUBJECT'
export const SELECT_SUBJECT_OPTIMISTIC = 'SELECT_SUBJECT_OPTIMISTIC'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSelectSubject (privateBankId) {
  return { type: RECEIVE_SELECT_SUBJECT, privateBankId }
}

export function selectSubjectOptimistic (bankId) {
  return { type: SELECT_SUBJECT_OPTIMISTIC, bankId }
}

// student has selected a subject
// here need to set up the private bank and make
// sure authz / hierarchy are correct
export function selectSubject (data) {
  return function (dispatch) {
    dispatch(selectSubjectOptimistic(data.bankId))

    // let options = {
    //   url: `${getDomain()}/middleman/banks/${data.bankId}/privatebankid`,
    //   headers: {
    //     'x-fbw-username': data.username
    //   }
    // }
    // return axios(options)
    // .then((privateBankId) => {
    //   console.log('got from middleman the selected subject\'s privateBankId of:', privateBankId);
    //
    //   save('privateBankId', privateBankId.data)
    //   dispatch(receiveSelectSubject(privateBankId.data))
    // })
    // .catch((error) => {
    //   console.log('error getting private bank id', error)
    // })
  }
}
