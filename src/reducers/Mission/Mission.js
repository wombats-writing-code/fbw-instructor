// mission reducer

import thunk from 'redux-thunk';
import 'lodash'

import {END_DATE} from 'react-dates/constants'

import {RECEIVE_MISSIONS} from './getMissions'
import {SELECT_MISSION} from './selectMission'

import {RECEIVE_CREATE_MISSION} from './createMission'
import {RECEIVE_UPDATE_MISSION} from './updateMission'
import {UPDATE_MISSION_FORM} from './updateMissionForm'

import {RECEIVE_RESULTS} from './getResults'

// import {createMissionPart, createMissionPartOptimistic} from './createMissionPart'
// import {updateMissionPart, updateMissionPartOptimistic} from './updateMissionPart'
// import {deleteMissionPart, deleteMissionPartOptimistic} from './deleteMissionPart'
// import {updateMissionOffered, updateMissionOfferedOptimistic} from './updateMissionOffered'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function missionReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_MISSIONS:
      return _.assign({}, state, {
        missions: action.missions,
        newMission: {
          startTime: null,
          deadline: null,
          displayName: '',
          genusTypeId: 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU',
          focusedInput: null,
          formError: true
        }
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

    case UPDATE_MISSION_FORM:
      // let's add some logic to the datepicker interactions ...
      // Probably shouldn't go here, but I'm not sure where it should really go
      let nextFocusedInput = null;
      if (_.has(action.data, "startDate") && state.newMission.startTime != action.data.startDate) {
        nextFocusedInput = END_DATE
      } else if (_.has(action.data, "focusedInput")) {
        nextFocusedInput = action.data.focusedInput
      }

      let newStartTime = _.has(action.data, "startDate") ? action.data.startDate : state.newMission.startTime,
        newDeadline = _.has(action.data, "endDate") ? action.data.endDate : state.newMission.deadline,
        newDisplayName = _.has(action.data, "displayName") ? action.data.displayName : state.newMission.displayName,
        newGenusTypeId = _.has(action.data, "genusTypeId") ? action.data.genusTypeId : state.newMission.genusTypeId;

      // lets do form validation
      let formError = false;
      if (newStartTime === null ||
          newDeadline === null ||
          newGenusTypeId === '' ||
          newDisplayName === '') {
        formError = true;
      }

      return _.assign({}, state, {
        newMission: {
          startTime: newStartTime,
          deadline: newDeadline,
          displayName: newDisplayName,
          genusTypeId: newGenusTypeId,
          focusedInput: nextFocusedInput,
          formError: formError
        }
      })

    default:
      return state
  }
}
