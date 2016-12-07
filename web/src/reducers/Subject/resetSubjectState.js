// used for logging out a user
// ----
// Action types
export const RECEIVE_RESET_SUBJECT_STATE = 'RECEIVE_RESET_SUBJECT_STATE'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveResetSubjectState (data) {
  return { type: RECEIVE_RESET_SUBJECT_STATE, data }
}

export function resetSubjectState () {
  return function (dispatch) {
    dispatch(receiveResetSubjectState())
  }
}
