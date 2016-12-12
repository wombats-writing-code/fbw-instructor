import 'lodash'

import { extractDisplayName } from 'fbw-platform-common/d2lutils'

import { LOGGED_IN_OPTIMISTIC, LOGGED_IN } from './logInUser'
import { UPDATE_USERNAME } from './updateUsername'
import { RECEIVE_SET_VISITOR_LOGIN } from './setVisitorLogin'
import { RECEIVE_LOG_OUT } from './logOutUser'
import { RECEIVE_SET_D2L_AUTHENTICATED_URL, SET_D2L_AUTHENTICATED_URL_OPTIMISTIC } from './setD2LAuthenticatedUrl'
import { RECEIVE_USER_OPTIMISTIC, RECEIVE_USER } from './retrieveUser'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  user: null,
  bankId: null,
  isLoginInProgress: false,
  form: {
    username: ''
  },
  d2l: {}
}

export default function userReducer (state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN_OPTIMISTIC:
      return _.assign({}, state, {
        isLoginInProgress: true
      })

    case LOGGED_IN:
      return _.assign({}, state, {
        user: {
          username: action.username,
          displayName: extractDisplayName(action.username),
          isVisitor: false
        },
        isLoginInProgress: false
      })

    case UPDATE_USERNAME:
      return _.assign({}, state, {
        form: {
          username: action.data.username ? action.data.username.replace(/\s/g, '') : ''
        }
      })

    case RECEIVE_LOG_OUT:
      return _.assign({}, state, {
        form: {
          username: ''
        },
        d2l: {},
        user: {
          displayName: 'Darth Vader',
          isVisitor: true,
          username: ''
        },
        isLoginInProgress: false
      })

    case SET_D2L_AUTHENTICATED_URL_OPTIMISTIC:
      return _.assign({}, state)

    case RECEIVE_SET_D2L_AUTHENTICATED_URL:
      return _.assign({}, state, {
        d2l: {
          authenticatedUrl: action.url
        }
      })

    case RECEIVE_SET_VISITOR_LOGIN:
      return _.assign({}, state, {
        user: {
          username: action.username,
          displayName: action.username.split('@')[0],
          isVisitor: true
        }
      })

    case RECEIVE_USER_OPTIMISTIC:
      return _.assign({}, state, {
        user: {
          username: null,
          displayName: null,
          isVisitor: state.user.isVisitor
        },
        d2l: {
          authenticatedUrl: null
        },
      })

    case RECEIVE_USER:
      return _.assign({}, state, {
        user: {
          isVisitor: state.user.isVisitor,
          username: action.data.username,
          displayName: state.user.isVisitor ? action.data.username : extractDisplayName(action.data.username)
        },
        d2l: {
          authenticatedUrl: action.data.url
        },
      })

    default:
      return state
  }
}
