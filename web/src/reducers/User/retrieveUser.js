

import Lockr from 'lockr'
import Q from 'q'

export const RECEIVE_USER = 'RECEIVE_USER'
export const RETRIEVE_USER_OPTIMISTIC = 'RETRIEVE_USER_OPTIMISTIC'

const receiveUser = (user) => {
  return {type: RECEIVE_USER, user}
}

const retrieveUserOptimistic = (user) => {
  return {type: RETRIEVE_USER_OPTIMISTIC, user}
}

export const retrieveUser = () => {
  return function(dispatch) {
    dispatch(retrieveUserOptimistic());

    return Q.when(Lockr.get('fbw-user'))
    .then( (user) => {
      dispatch(receiveUser(user))
    });
  }
}
