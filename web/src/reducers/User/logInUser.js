// ----
// Action types
export const LOGGED_IN_OPTIMISTIC = 'LOGGED_IN_OPTIMISTIC'
export const LOGGED_IN = 'LOGGED_IN'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function loggedIn (username) {
  return { type: LOGGED_IN, username }
}

export function loggedInOptimistic () {
  return { type: LOGGED_IN_OPTIMISTIC }
}

function createBaseQBankInstructorAuthorizations (username) {
// For now, we won't use this for instructors, because there is no
//   need on the QBank side to record the username...i.e., we aren't
//   having instructors comment on student work, or anything.
// So basically all calls will be made as the default proxy.
}

// inject username into state tree
export function logInUser (school, username) {
  return function (dispatch) {
    dispatch(loggedInOptimistic())

    // here we need to check that qbank account exists, with Authorization
    // if not, create them
    username = `${username}@${school}.edu`
    return dispatch(loggedIn(username))
  }
}
