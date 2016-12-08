// ----
// Action types
export const RECEIVE_SET_VISITOR_LOGIN = 'RECEIVE_SET_VISITOR_LOGIN'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSetVisitorLogin (username) {
  return { type: RECEIVE_SET_VISITOR_LOGIN, username }
}

// update visitor state in state tree
export function setVisitorLogin (school, username) {
  return function (dispatch) {
    dispatch(receiveSetVisitorLogin(`${username}@${school}.edu`))
  }
}
