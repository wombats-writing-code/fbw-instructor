
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
let Q = require('q')

import {
  getDomain,
  getSchoolQBankId,
  momentToQBank,
  save,
  BASE_BANKS,
  STUDENT_AUTHORIZATION_FUNCTIONS
} from '../../utilities'
// ----
// Action types
export const LOGGED_IN_OPTIMISTIC = 'LOGGED_IN_OPTIMISTIC'
export const LOGGED_IN = 'LOGGED_IN'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function loggedIn (data) {
  return { type: LOGGED_IN, data }
}

export function loggedInOptimistic () {
  return { type: LOGGED_IN_OPTIMISTIC }
}

function createBaseQBankStudentAuthorizations (username) {
  let qualifierIds = BASE_BANKS
  let now = moment.utc()
  let endDate = momentToQBank(now)
  let params = {
    data: {
      bulk: []
    },
    method: 'POST',
    url: `${getDomain()}/middleman/authorizations`
  }

  endDate.month = endDate.month + 6

  if (endDate.month > 12) {
    endDate.month = endDate.month - 12
    endDate.year++
  }

  if (endDate.month === 2 && endDate.day > 28) {
    endDate.day = 28
  }

  if ([4, 6, 9, 11].indexOf(endDate.month) >= 0 && endDate.day === 31) {
    endDate.day = 30
  }
  _.each(qualifierIds, function (qualifierId) {
    _.each(STUDENT_AUTHORIZATION_FUNCTIONS, function (functionId) {
      params.data.bulk.push({
        agentId: username,
        endDate: endDate,
        functionId: functionId,
        qualifierId: qualifierId
      })
    })
  })
  return axios(params)
}

// inject username and authentication token into state tree
export function logInUser (school, username) { // , token? Will we need this for D2L?) {
  return function (dispatch) {
    dispatch(loggedInOptimistic())

    // here we need to check that qbank account exists, with Authorization
    // if not, create them
    // TODO: need to check some other URL .... or some other bankId
    username = `${username}@${school}.edu`
    // console.log(params)
    // just always create authz....checking is getting caught by Memcached
    return createBaseQBankStudentAuthorizations(username)
    .then((result) => {
      // save the username in local storage
      save('username', username)
      dispatch(loggedIn({ username: username}))
    })
    .catch((error) => {
      console.log('another authz creation error', error)
    })
  }
}
