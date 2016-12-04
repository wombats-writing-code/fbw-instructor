import { get } from '../../utilities'

export const RECEIVE_GET_SELECTED_SUBJECT = 'RECEIVE_GET_SELECTED_SUBJECT'

export function receiveGetSelectedSubject(privateBankId) {
  return {type: 'RECEIVE_GET_SELECTED_SUBJECT', privateBankId}
}

export function getSelectedSubject() {
  return function(dispatch) {
    get('privateBankId')
    .then((privateBankId) => {
      //console.log('privateBankId', privateBankId)
      dispatch(receiveGetSelectedSubject(privateBankId))
    })
  }
}
