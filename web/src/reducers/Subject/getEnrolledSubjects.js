import { get } from '../../utilities'

export const RECEIVE_GET_ENROLLED_SUBJECTS = 'RECEIVE_GET_ENROLLED_SUBJECTS'

export function receiveGetEnrolledSubjects(bankIds) {
  return {type: 'RECEIVE_GET_ENROLLED_SUBJECTS', bankIds}
}

export function getEnrolledSubjects() {
  return function(dispatch) {
    get('enrolledBankIds')
    .then((bankIds) => {
      //console.log('bankIds', bankIds)
      dispatch(receiveGetEnrolledSubjects(bankIds))
    })
  }
}
