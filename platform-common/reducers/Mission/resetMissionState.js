// used for logging out a user
// ----
// Action types
export const RECEIVE_RESET_MISSION_STATE = 'RECEIVE_RESET_MISSION_STATE'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveResetMissionState (data) {
  return { type: RECEIVE_RESET_MISSION_STATE, data }
}

export function resetMissionState () {
  return function (dispatch) {
    dispatch(receiveResetMissionState())
  }
}
