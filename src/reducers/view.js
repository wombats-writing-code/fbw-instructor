// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_VIEW = 'CHANGE_VIEW'
export const CHANGE_MOUSEOVER = 'CHANGE_MOUSEOVER'
export const CHANGE_CLICK = 'CHANGE_CLICK'
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

export function selectDirective(directive, viewName) {
  return {
    type    : SELECT_DIRECTIVE,
    directive,
    viewName
  }
}

export function changeMouseOver(entity, viewName) {
  return {
    type    : CHANGE_MOUSEOVER,
    entity,
    viewName
  }
}

export function changeClick(entity, viewName) {
  return {
    type    : CHANGE_CLICK,
    entity,
    viewName
  }
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  name: 'dashboard.preflightView'
}
export default function viewReducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return action.view

    case SELECT_DIRECTIVE:
      return _.assign({}, state, {
        currentDirective: action.directive
      });

    default:
      return state
  }

  return state
}
