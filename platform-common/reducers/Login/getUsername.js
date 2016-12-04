import Q from 'q'
import { get } from '../../utilities'

export const GET_USERNAME = 'GET_USERNAME'
export const GET_USERNAME_OPTIMISTIC = 'GET_USERNAME_OPTIMISTIC'
export const RECEIVE_USERNAME = 'RECEIVE_USERNAME'

export function receiveUsername(username, url) {
  return {type: 'RECEIVE_USERNAME', username, url}
}

function getUsernameOptimistic(data) {
  return {type: 'GET_USERNAME_OPTIMISTIC', data}
}

export function getUsername() {
  return function(dispatch) {
    dispatch(getUsernameOptimistic());

    return Q.all([get('username'), get('d2lUrl')])
    .then((data) => {
      // console.log(data)
      dispatch(receiveUsername(data[0], data[1]))
    })
  }
}
