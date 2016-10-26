// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_VIEW = 'CHANGE_VIEW'

// ------------------------------------
// Actions
// ------------------------------------
export function changeView (view) {
  return {
    type    : CHANGE_VIEW,
    view: view
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {name: 'dashboard'}
export default function viewReducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return action.view

    default:
      return state
  }

  return state
}
