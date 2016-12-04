
import _ from 'lodash'
import axios from 'axios'

import { getDomain, convertPythonDateToJS } from '../../utilities'

// ----
// Action types
export const RECEIVE_MISSIONS = 'RECEIVE_MISSIONS'
export const GET_MISSIONS = 'GET_MISSIONS'
export const GET_MISSIONS_OPTIMISTIC = 'GET_MISSIONS_OPTIMISTIC'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveMissions (missions) {
  return { type: RECEIVE_MISSIONS, missions }
}

export function getMissionsOptimistic (data) {
  return { type: GET_MISSIONS_OPTIMISTIC, data }
}

// returns a list of Mission offereds
export function getMissions (data) {
  return function (dispatch) {
    // console.log('getMissions of', data.bankId);
    dispatch(getMissionsOptimistic())

    let options = {
      url: `${getDomain()}/middleman/banks/${data.bankId}/missions`,
      headers: {
        'x-fbw-username': data.username
      }
    }
    return axios(options)
    .then((missions) => {
      // console.log('received getting missions', missions)
      // Python months run from 1-12, JavaScript months run from 0-11. We need to adjust the dates here.
      missions = _.map(missions.data, (mission) => {
        return _.assign({}, mission, {
          startTime: convertPythonDateToJS(mission.startTime),
          deadline: convertPythonDateToJS(mission.deadline)
        })
      })

      dispatch(receiveMissions(missions))
    })
    .catch((error) => {
      console.log('error getting missions data', error)
    })
  }
}
