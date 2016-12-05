import 'lodash'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  user: null,
  bankId: null,
  isLoginInProgress: false
}

export default function userReducer (state = initialState, action) {
  switch (action.type) {

    default:
      return state
  }
}
