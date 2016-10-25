// mission reducer

import thunk from 'redux-thunk';
import 'lodash'

import {RECEIVE_MISSIONS, getMissions, getMissionsOptimistic} from './getMissions'
import {SELECT_MISSION, selectMission} from './selectMission'

import {createMission, createMissionOptimistic} from './createMission'
import {updateMission, updateMissionOptimistic} from './updateMission'
import {deleteMission, deleteMissionOptimistic} from './deleteMission'

// import {createMissionPart, createMissionPartOptimistic} from './createMissionPart'
// import {updateMissionPart, updateMissionPartOptimistic} from './updateMissionPart'
// import {deleteMissionPart, deleteMissionPartOptimistic} from './deleteMissionPart'
// import {updateMissionOffered, updateMissionOfferedOptimistic} from './updateMissionOffered'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function missionReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_MISSIONS:
      return {
        missions: action.missions
      }

    case SELECT_MISSION:
      console.log('SELECT_MISSION', action);
      return _.assign({}, state, {
        currentMission: action.mission
      })


    // case GET_ASSESSMENT:
    //   return _.find(state.missions, {id: action.missionId});
    //
    // case GET_ASSESSMENTS:
    //   return getMissions(action.data)
    //
    // case CREATE_ASSESSMENT:
    //   return createMission(action.data)
    //
    // case UPDATE_ASSESSMENT:
    //   return updateMission(action.data)
    //
    // case DELETE_ASSESSMENT:
    //   return deleteMission(action.data)
    //
    // case CREATE_ASSESSMENT_PART:
    //   return createMissionPart(action.data)
    //
    // case UPDATE_ASSESSMENT_PART:
    //   return updateMissionPart(action.data)
    //
    // case DELETE_ASSESSMENT_PART:
    //   return deleteMission(action.data)
    //
    // case UPDATE_ASSESSMENT_OFFERED:
    //   return updateMissionOffered(action.data)

    default:
      return state
  }
}
