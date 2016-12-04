import _ from 'lodash'
import axios from 'axios'
import { getDomain } from '../../utilities'
import { targetStatus, filterItemsByTarget } from '../../selectors'

// ----
// Action types
export const RECEIVE_CREATE_TAKE_MISSION = 'RECEIVE_CREATE_TAKE_MISSION'
export const CREATE_TAKE_MISSION = 'CREATE_TAKE_MISSION'
export const CREATE_TAKE_MISSION_OPTIMISTIC = 'CREATE_TAKE_MISSION_OPTIMISTIC'

// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveOpenMission (mission) {
  return { type: RECEIVE_CREATE_TAKE_MISSION, mission }
}

export function openMissionOptimistic (mission) {
  return { type: CREATE_TAKE_MISSION_OPTIMISTIC, mission }
}

// returns the sections & questions for a mission
export function selectOpenMission (data) {
  return function (dispatch) {
    dispatch(openMissionOptimistic(data.mission))

    let options = {
      url: `${getDomain()}/middleman/banks/${data.mission.assignedBankIds[0]}/offereds/${data.mission.assessmentOfferedId}/takeMission`,
      headers: {
        'x-fbw-username': data.username
      }
    }
    return axios(options)
    .then((response) => {
      // console.log('received mission questions', response)
      // also need to update hasNavigated for the correct target status
      let _assessmentSections = response.data;

      _.each(_assessmentSections, (section) => {
        let sortedItems = filterItemsByTarget(section.questions);
        let targetsNavigatedInSection = [];
        _.each(sortedItems, (questionsList, targetKey) => {
          // Now go through each of the non-pristine target questions and figure out
          //   if the route has been finished.
          // If the route ends in an unanswered question, route not finished.
          // If the route ends in a wrong response, route not finished.
          // Route only finished if the last question isCorrect.
          if (targetStatus(questionsList[0]) !== 'PRISTINE') {
            let lastRouteQuestion = questionsList[questionsList.length - 1];
            if (lastRouteQuestion.responded && lastRouteQuestion.isCorrect) {
              targetsNavigatedInSection.push(questionsList[0].id);
            }
          }
        });
        _.each(section.questions, (question) => {
          if (targetsNavigatedInSection.indexOf(question.id) >= 0) {
            question.hasNavigated = true;
          }
        })
      });
      dispatch(receiveOpenMission(_assessmentSections))
    })
    .catch((error) => {
      console.log('error getting mission data', error)
    })
  }
}
