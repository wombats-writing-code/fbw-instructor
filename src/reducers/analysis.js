// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_MOUSEOVER = 'CHANGE_MOUSEOVER'
export const CHANGE_CLICK = 'CHANGE_CLICK'

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

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  outcomesView: {
    currentMouseOver: null,
    currentClick: null
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


    default:
      return state
  }

  return state
}
