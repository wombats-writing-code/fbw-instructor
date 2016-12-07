// ----
// Action types
export const RECEIVE_SET_VISITOR_LOGIN = 'RECEIVE_SET_VISITOR_LOGIN'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveSetVisitorLogin (visitor) {
  return { type: RECEIVE_SET_VISITOR_LOGIN, visitor }
}

// update visitor state in state tree
export function setVisitorLogin (visitor) {
  return function (dispatch) {
    dispatch(receiveSetVisitorLogin(visitor))
  }
}
