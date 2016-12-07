// ----
// Action types
export const UPDATE_USERNAME = 'UPDATE_USERNAME'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function getUpdatedUsername (data) {
  return { type: UPDATE_USERNAME, data }
}

// update username in state tree
export function updateUsername (username) {
  return function (dispatch) {
    dispatch(getUpdatedUsername(username))
  }
}
