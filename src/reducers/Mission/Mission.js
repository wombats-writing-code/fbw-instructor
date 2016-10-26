// mission reducer

import thunk from 'redux-thunk';
import 'lodash'

import {RECEIVE_MISSIONS} from './getMissions'
import {SELECT_MISSION} from './selectMission'

import {RECEIVE_CREATE_MISSION} from './createMission'
import {RECEIVE_UPDATE_MISSION} from './updateMission'

import {RECEIVE_RESULTS} from './getResults'

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

    case RECEIVE_RESULTS:
      return _.assign({}, state, {
        results: action.results
      });


    case RECEIVE_CREATE_MISSION:
      return _.assign({}, state, {
        missions: [...state.missions, action.mission],      // creates a new array of existing missions with the new mission appended
        currentMission: action.mission
      })

    case RECEIVE_UPDATE_MISSION:
      return _.assign({}, state, {
        missions: _.map((m) => {
          if (m.id === action.mission.id) {
            return action.mission;
          }

          return m;
        }),
        currentMission: action.mission
      })

    default:
      return state
  }
}
