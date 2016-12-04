import { get } from '../../utilities'

export const RECEIVE_GET_SAVED_OUTCOMES = 'RECEIVE_GET_SAVED_OUTCOMES'

export function receiveGetSavedOutcomes(outcomes) {
  return {type: 'RECEIVE_GET_SAVED_OUTCOMES', outcomes}
}

export function getSavedOutcomes() {
  return function(dispatch) {
    get('outcomes')
    .then((outcomes) => {
      //console.log('outcomes', outcomes)
      dispatch(receiveGetSavedOutcomes(outcomes))
    })
  }
}
