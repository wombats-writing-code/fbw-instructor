// mission reducer

import thunk from 'redux-thunk';
import 'lodash'

import {END_DATE} from 'react-dates/constants'

import {GET_MISSIONS_OPTIMISTIC, RECEIVE_MISSIONS} from './getMissions'
import {SELECT_MISSION} from './selectMission'
import {CLEAR_SELECTED_MISSION} from './clearSelectedMission'

import {CREATE_TEST_FLIGHT_MISSIONS_OPTIMISTIC, RECEIVE_CREATE_TEST_FLIGHT_MISSIONS} from './createTestFlightMissions'
import {CREATE_MISSION_OPTIMISTIC, RECEIVE_CREATE_MISSION} from './createMission'
import {RECEIVE_UPDATE_MISSION} from './updateMission'
import {UPDATE_MISSION_FORM} from './updateMissionForm'
import {UPDATE_EDIT_MISSION_FORM} from './updateEditMissionForm'
import {UPDATE_SPAWN_DATE} from './updateSpawnDate'
import {RECEIVE_DELETE_MISSION} from './deleteMission'

import {GET_RESULTS_OPTIMISTIC, RECEIVE_RESULTS} from './getResults'

// this probably shouldn't belong here...
import {qbankToMoment} from '../common'

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
    case GET_MISSIONS_OPTIMISTIC:
      return _.assign({}, state, {
        isGetMissionsInProgress: true
      });

    case RECEIVE_MISSIONS:
      return _.assign({}, state, {
        missions: action.missions,
        newMission: stampNewMission(),
        isGetMissionsInProgress: false
      });

    case SELECT_MISSION:
      return _.assign({}, state, {
        currentMission: action.mission,
        isSpawnInProgress: false,
        spawnDate: null,
        spawnDateFocused: false,
        editMission: action.mission ? {
          id: action.mission.id,
          assessmentOfferedId: action.mission.assessmentOfferedId,
          displayName: action.mission.displayName.text,
          genusTypeId: action.mission.genusTypeId,
          focusedInput: null,
          formError: false,
          startTime: qbankToMoment(action.mission.startTime),
          deadline: qbankToMoment(action.mission.deadline)
        } : null
      })

    case CLEAR_SELECTED_MISSION:
      return _.assign({}, state, {
        currentMission: null
      })

    case GET_RESULTS_OPTIMISTIC:
      return _.assign({}, state, {
        isGetResultsInProgress: true
      });

    case RECEIVE_RESULTS:
      return _.assign({}, state, {
        results: action.results,
        isGetResultsInProgress: false
      });

    case CREATE_MISSION_OPTIMISTIC:
      return _.assign({}, state, {
        isCreateMissionInProgress: true,
      })

    case RECEIVE_CREATE_MISSION:
      return _.assign({}, state, {
        missions: [...state.missions, action.mission],      // creates a new array of existing missions with the new mission appended
        newMission: stampNewMission(),
        currentMission: action.mission,
        isCreateMissionInProgress: false
      })

    case RECEIVE_UPDATE_MISSION:
      return _.assign({}, state, {
        missions: _.map(state.missions, (m) => {
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
        // newGenusTypeId = _.has(action.data, "genusTypeId") ? action.data.genusTypeId : state.newMission.genusTypeId;
        newGenusTypeId = 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU';

      // lets do form validation
      let formError = false;
      if (newStartTime === null ||
          newDeadline === null ||
          newGenusTypeId === '' ||
          newDisplayName === '') {
        formError = true;
      }

      // let selectedModule = _.clone(state.newMission.selectedModule);
      // if (action.data.selectedModule) {
      //   selectedModule = action.data.selectedModule;
      // }

      let selectedDirectives = _.clone(state.newMission.selectedDirectives) || [];
      if (action.data.toggledDirective) {
        let isAlreadySelected = _.find(state.newMission.selectedDirectives, (item) => item.outcome.id === action.data.toggledDirective.outcome.id);

        if (!state.newMission.selectedDirectives) {
          selectedDirectives = [action.data.toggledDirective];

        } else if (isAlreadySelected) {
          selectedDirectives = _.reject(state.newMission.selectedDirectives, (item) => item.outcome.id === isAlreadySelected.outcome.id);

        } else {
          selectedDirectives = [...selectedDirectives, action.data.toggledDirective];
        }
      }

      // console.log('selectedDirectives', selectedDirectives)

      return _.assign({}, state, {
        newMission: {
          startTime: newStartTime,
          deadline: newDeadline,
          displayName: newDisplayName,
          genusTypeId: newGenusTypeId,
          focusedInput: nextFocusedInput,
          formError: formError,
          selectedModule: action.data.selectedModule || state.newMission.selectedModule,
          selectedDirectives: selectedDirectives
        }
      })

    case UPDATE_EDIT_MISSION_FORM:
      // let's add some logic to the datepicker interactions ...
      // Probably shouldn't go here, but I'm not sure where it should really go
      let nextFocusedInputEdit = null;
      if (_.has(action.data, "startDate") && state.editMission.startTime != action.data.startDate) {
        nextFocusedInputEdit = END_DATE
      } else if (_.has(action.data, "focusedInput")) {
        nextFocusedInputEdit = action.data.focusedInput
      }

      let newStartTimeEdit = _.has(action.data, "startDate") ? action.data.startDate : state.editMission.startTime,
        newDeadlineEdit = _.has(action.data, "endDate") ? action.data.endDate : state.editMission.deadline,
        newDisplayNameEdit = _.has(action.data, "displayName") ? action.data.displayName : state.editMission.displayName,
        // newGenusTypeIdEdit = _.has(action.data, "genusTypeId") ? action.data.genusTypeId : state.editMission.genusTypeId;
        newGenusTypeIdEdit = 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU';

      // lets do form validation
      let formErrorEdit = false;
      if (newStartTimeEdit === null ||
          newDeadlineEdit === null ||
          newGenusTypeIdEdit === '' ||
          newDisplayNameEdit === '') {
        formErrorEdit = true;
      }

      return _.assign({}, state, {
        editMission: {
          id: state.editMission.id,
          assessmentOfferedId: state.editMission.assessmentOfferedId,
          startTime: newStartTimeEdit,
          deadline: newDeadlineEdit,
          displayName: newDisplayNameEdit,
          genusTypeId: newGenusTypeIdEdit,
          focusedInput: nextFocusedInputEdit,
          formError: formErrorEdit
        }
      })

    case CREATE_TEST_FLIGHT_MISSIONS_OPTIMISTIC:
      return _.assign({}, state, {
        isSpawnInProgress: true
      })

    case UPDATE_SPAWN_DATE:
      let newSpawnDate = _.has(action.data, "date") ? action.data.date : state.spawnDate
      return _.assign({}, state, {
        spawnDate: newSpawnDate,
        spawnDateFocused: action.data.focused ? action.data.focused : false
      })

    case RECEIVE_CREATE_TEST_FLIGHT_MISSIONS:
      return _.assign({}, state, {
        isSpawnInProgress: false,
        spawnedMissionsByMission: _.assign({}, state.spawnedMissionsByMission, {
          [action.originalMission.id]: action.missions
        })
      })

    case RECEIVE_DELETE_MISSION:
      return _.assign({}, state, {
        missions: _.filter(state.missions, (m) => {
          return m.id !== action.mission.id
        })
      })

    default:
      return state
  }
}


const stampNewMission = () => {
  return {
    startTime: null,
    deadline: null,
    displayName: '',
    genusTypeId: 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU',
    focusedInput: null,
    formError: true
  }
}
