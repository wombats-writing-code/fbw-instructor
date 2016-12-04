// mission reducer
import _ from 'lodash'

import { isTarget, targetKey } from '../../selectors'
import { updateAssessmentSectionsWithResponse } from '../../utilities'

import { GET_MISSIONS_OPTIMISTIC, RECEIVE_MISSIONS } from './getMissions'
import { CREATE_TAKE_MISSION_OPTIMISTIC, CREATE_TAKE_MISSION, RECEIVE_CREATE_TAKE_MISSION } from './selectOpenMission'
import { GET_USER_MISSION_RESULTS_OPTIMISTIC, RECEIVE_GET_USER_MISSION_RESULTS } from './selectClosedMission'
import { SUBMIT_RESPONSE, SUBMIT_RESPONSE_OPTIMISTIC, RECEIVE_SUBMIT_RESPONSE } from './submitResponse'
import { SHOW_ANSWER_OPTIMISTIC, RECEIVE_SHOW_ANSWER } from './showAnswer'

import { RECEIVE_RESET_MISSION_STATE } from './resetMissionState'

import { SELECT_DIRECTIVE } from './selectDirective'
import { SELECT_TARGET } from './selectTarget'
import { SELECT_CHOICE } from './selectChoice'
import { SET_QUESTION_LIST_HEIGHT } from './setQuestionListHeight'
import { SET_CHOICE_HEIGHT } from './setChoiceHeight'

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function missionReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_RESET_MISSION_STATE:
      return {}

    case GET_MISSIONS_OPTIMISTIC:
      return _.assign({}, state, {
        isGetMissionsInProgress: true
      })

    case RECEIVE_MISSIONS:
      return _.assign({}, state, {
        missions: action.missions,
        isGetMissionsInProgress: false
      })

    case SELECT_DIRECTIVE:
      return _.assign({}, state, {
        currentDirectiveIndex: action.directiveIndex,
        currentTargetIndex: null,
        selectedChoiceId: null
      })

    case SELECT_TARGET:
      return _.assign({}, state, {
        currentTargetIndex: action.targetIndex,
        questionListHeight: 0,
        heightByChoice: {},
        selectedChoiceId: null
      })

    case CREATE_TAKE_MISSION_OPTIMISTIC:
    case GET_USER_MISSION_RESULTS_OPTIMISTIC:
      return _.assign({}, state, {
        resultsExistForUser: true,
        currentMission: action.mission,
        isSubmitTakeMissionInProgress: true
      });

    case RECEIVE_CREATE_TAKE_MISSION:
      return _.assign({}, state, {
        resultsExistForUser: true,
        currentMissionSections: action.mission,
        isSubmitTakeMissionInProgress: false
      });

    case RECEIVE_GET_USER_MISSION_RESULTS:
      return _.assign({}, state, {
        resultsExistForUser: action.resultsExistForUser,
        currentMissionSections: action.mission,
        isSubmitTakeMissionInProgress: false
      });

    case SUBMIT_RESPONSE_OPTIMISTIC:
      return _.assign({}, state, {
        isInProgressSubmitChoice: true,
        selectedChoiceId: null
      })

    case SHOW_ANSWER_OPTIMISTIC:
      return _.assign({}, state, {
        isInProgressShowAnswer: true,
        selectedChoiceId: null
      })

    case RECEIVE_SUBMIT_RESPONSE:
      // update state missions (insert the new question if it's not a target),
      // and also the responded question's response state
      return _.assign({}, state, {
        isInProgressSubmitChoice: false,
        currentMissionSections: updateAssessmentSectionsWithResponse(state.currentMissionSections,
          action.response)
      })

    case RECEIVE_SHOW_ANSWER:
      // update state missions (insert the new question if it's not a target),
      // and also the responded question's response state
      return _.assign({}, state, {
        isInProgressShowAnswer: false,
        currentMissionSections: updateAssessmentSectionsWithResponse(state.currentMissionSections,
          action.response)
      })

    case SET_QUESTION_LIST_HEIGHT:
      return _.assign({}, state, {
        questionListHeight: action.questionListHeight
      })

    case SELECT_CHOICE:
      return _.assign({}, state, {
        selectedChoiceId: action.choiceId
      })

    case SET_CHOICE_HEIGHT:
      let updatedHeightMap = _.assign({}, state.heightByChoice, action.height)
      return _.assign({}, state, {
        heightByChoice: updatedHeightMap
      })

    default:
      return state
  }
}
