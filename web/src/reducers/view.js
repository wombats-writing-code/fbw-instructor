// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_VIEW = 'CHANGE_VIEW'
export const SELECT_DIRECTIVE = 'SELECT_DIRECTIVE'

import {RECEIVE_CREATE_MISSION, RECEIVE_CREATE_MISSIONS} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/'
// ------------------------------------
// Actions
// ------------------------------------
export function changeView (view) {
  return {
    type    : CHANGE_VIEW,
    view: view
  }
}
//
// export function selectDirective(directive, viewName) {
//   return {
//     type    : SELECT_DIRECTIVE,
//     directive,
//     viewName
//   }
// }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  name: 'dashboard.resultsView'
}
export default function viewReducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return action.view

    case CHANGE_VIEW:
      return _.assign({}, state, {
        name: 'dashboard.resultsView'
      })

    default:
      return state
  }

  return state
}
