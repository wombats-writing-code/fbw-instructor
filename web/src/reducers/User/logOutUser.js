import { flush } from '../utilities'

// ----
// Action types
export const RECEIVE_LOG_OUT = 'RECEIVE_LOG_OUT'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveLogOut (data) {
  return { type: RECEIVE_LOG_OUT, data }
}

export function logOutUser () {
  return function (dispatch) {
    // flush()

    dispatch(receiveLogOut())
  }
}
