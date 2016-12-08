import { save } from '../utilities'

// ----
// Action types
export const RECEIVE_SET_D2L_AUTHENTICATED_URL = 'RECEIVE_SET_D2L_AUTHENTICATED_URL'
export const SET_D2L_AUTHENTICATED_URL_OPTIMISTIC = 'SET_D2L_AUTHENTICATED_URL_OPTIMISTIC'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSetD2LAuthenticatedUrl (url) {
  return { type: RECEIVE_SET_D2L_AUTHENTICATED_URL, url }
}

export function setD2LAuthenticatedUrlOptimistic (data) {
  return { type: SET_D2L_AUTHENTICATED_URL_OPTIMISTIC, data }
}

export function setD2LAuthenticatedUrl (url) {
  return function (dispatch) {
    // the returned authenticated URL,
    //   which includes the params that the valence library
    //   needs to make other calls like whoami and enrollments
    console.log('d2l url', url)
    // save('d2lUrl', url)
    dispatch(receiveSetD2LAuthenticatedUrl(url))
  }
}
