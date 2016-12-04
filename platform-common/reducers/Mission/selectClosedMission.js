import axios from 'axios'
import { getDomain } from '../../utilities'

// ----
// Action types
export const RECEIVE_GET_USER_MISSION_RESULTS = 'RECEIVE_GET_USER_MISSION_RESULTS'
export const GET_USER_MISSION_RESULTS_OPTIMISTIC = 'GET_USER_MISSION_RESULTS_OPTIMISTIC'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveGetUserMissionResults (mission, resultsExistForUser) {
  return { type: RECEIVE_GET_USER_MISSION_RESULTS, mission, resultsExistForUser }
}

export function getUserMissionResultsOptimistic (data) {
  return { type: GET_USER_MISSION_RESULTS_OPTIMISTIC, data }
}

export function selectClosedMission (data) {
  return function (dispatch) {
    dispatch(getUserMissionResultsOptimistic())

    let options = {
      url: `${getDomain()}/middleman/banks/${data.mission.assignedBankIds[0]}/offereds/${data.mission.assessmentOfferedId}/results`,
      headers: {
        'x-fbw-username': data.username
      }
    }
    return axios(options)
    .then((response) => {
      console.log('received mission results', response)

      dispatch(receiveGetUserMissionResults(response.data, true))
    })
    .catch((error) => {
      // this will get hit by a 500 when the user has no results
      dispatch(receiveGetUserMissionResults(null, false))
      // console.log('error getting mission results for user', error)
    })
  }
}
