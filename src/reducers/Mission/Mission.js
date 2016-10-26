// mission reducer

import thunk from 'redux-thunk';
import 'lodash'

import {RECEIVE_MISSIONS, getMissions, getMissionsOptimistic} from './getMissions'
import {SELECT_MISSION, selectMission} from './selectMission'

import {CREATE_MISSION, createMission, createMissionOptimistic} from './createMission'
import {UPDATE_MISSION, updateMission, updateMissionOptimistic} from './updateMission'
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
      return _.assign({}, state, {
        missions: action.missions
      });

    case SELECT_MISSION:
      return _.assign({}, state, {
        currentMission: action.mission
      })

    case CREATE_MISSION:
      return _.assign({}, state, {
        missions: [...state.missions, action.mission],      // creates a new array of existing missions with the new mission appended
        currentMission: action.mission
      })

    case UPDATE_MISSION:
      return _.assign({}, state, {
        missions: _.map((m) => {
          if (m.id === action.mission.id) {
            return action.mission;
          }

          return m;
        }),
        currentMission: action.mission
      })

    // case GET_MISSION:
    //   return _.find(state.missions, {id: action.missionId});
    //
    // case GET_MISSIONS:
    //   return getMissions(action.data)
    //

    //
    // case DELETE_MISSION:
    //   return deleteMission(action.data)
    //
    // case CREATE_MISSION_PART:
    //   return createMissionPart(action.data)
    //
    // case UPDATE_MISSION_PART:
    //   return updateMissionPart(action.data)
    //
    // case DELETE_MISSION_PART:
    //   return deleteMission(action.data)
    //
    // case UPDATE_MISSION_OFFERED:
    //   return updateMissionOffered(action.data)

    default:
      return state
  }
}
