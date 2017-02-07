// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_VIEW = 'CHANGE_VIEW'
export const SELECT_DIRECTIVE = 'SELECT_DIRECTIVE'

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
    // 
    // case SELECT_DIRECTIVE:
    //   return _.assign({}, state, {
    //     currentDirective: action.directive
    //   });

    default:
      return state
  }

  return state
}
