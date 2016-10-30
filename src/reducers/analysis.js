// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_MOUSEOVER = 'CHANGE_MOUSEOVER'
export const CHANGE_CLICK = 'CHANGE_CLICK'
export const SELECT_DIRECTIVE = 'SELECT_DIRECTIVE'


// ------------------------------------
// Actions
// ------------------------------------
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

export function selectDirective(directive, viewName) {
  return {
    type    : SELECT_DIRECTIVE,
    directive,
    viewName
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  'dashboard.outcomesView': {
    currentMouseOver: null,
    currentClick: null
  },
  'dashboard.questionsView': {

  }
}
export default function analysisReducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_MOUSEOVER:
      return _.assign({}, state, {
        [action.viewName]: {
          currentMouseOver: action.entity,
        }
      });

    case CHANGE_CLICK:
      return _.assign({}, state, {
        [action.viewName]: {
          currentMouseOver: null,
          currentClick: action.entity
        }
      });

    case SELECT_DIRECTIVE:
      return _.assign({}, state, {
        [action.viewName]: {
          currentDirective: action.directive
        }
      })

    default:
      return state
  }

  return state
}
