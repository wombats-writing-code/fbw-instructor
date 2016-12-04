// login reducer

import _ from 'lodash'

import { LOGGED_IN_OPTIMISTIC, LOGGED_IN } from './logInUser'
import { UPDATE_USERNAME } from './updateUsername'
import { RECEIVE_SET_VISITOR_LOGIN } from './setVisitorLogin'
import { RECEIVE_LOG_OUT } from './logOutUser'
import { RECEIVE_SET_D2L_AUTHENTICATED_URL, SET_D2L_AUTHENTICATED_URL_OPTIMISTIC } from './setD2LAuthenticatedUrl'
import { GET_USERNAME_OPTIMISTIC, RECEIVE_USERNAME } from './getUsername'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoginInProgress: false,
  form: {
    username: ''
  }
}
export default function loginReducer (state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN_OPTIMISTIC:
      return _.assign({}, state, {
        isLoginInProgress: true
      })

    case LOGGED_IN:
      return _.assign({}, state, {
        username: action.data.username,
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
          username: '',
          school: 'acc'
        },
        d2l: {},
        username: null,
        isLoginInProgress: false,
        isVisitor: false
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
        isVisitor: action.visitor
      })

    case GET_USERNAME_OPTIMISTIC:
      return _.assign({}, state, {
        username: null,
        d2l: {
          authenticatedUrl: null
        },
        initialized: false
      })

    case RECEIVE_USERNAME:
      return _.assign({}, state, {
        username: action.username,
        d2l: {
          authenticatedUrl: action.url
        },
        initialized: true
      })

    default:
      return state
  }
}
