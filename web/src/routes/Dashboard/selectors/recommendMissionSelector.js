import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getMapping} from 'fbw-platform-common/selectors'
import {isTarget} from 'fbw-platform-common/selectors/mission'
import {getRoster} from 'fbw-platform-common/selectors/bank'
import {osidToDisplayName, agentIdFromTakingAgentId, d2LDisplayNameToDisplayName,
  agentIdFromD2LRoster
} from 'fbw-platform-common/selectors/login'
import {notAchievedOnAttempt, notTaken} from './common'


export const recommendMissionSelector = createSelector(
  [
    state => state.result.phaseIResults,
    state => state.mission.currentMission,
    getMapping,
    getRoster
  ]
  , (results, mission, mapping, roster) => {

  if (!results || !mapping) return null;

  // ====
  // case 1: the taken has sections
  // student gets a directive again if they didn't answer every Target correctly
  // ====
  let studentRecommendations = _.map(results, (taken) => {
    console.log('taken', taken)

    let newDirectives = [];
    _.each(taken.sections, function (section) {
      let targetQuestions = _.filter(section.questions, isTarget),
        numberRight = _.compact(_.map(targetQuestions, function (question) {
          if (question.response && question.response.isCorrect) {
              return question
          }
        })).length;

      // console.log('num right', numberRight, 'total', targetQuestions.length)
      if (numberRight < targetQuestions.length) {
        newDirectives.push({
          learningObjectiveId: section.learningObjectiveId,
          quota: targetQuestions.length,
          waypointQuota: 1,
          itemBankId: section.questions[0].bankId,
          minimumProficiency: section.minimumProficiency
        })
      }
    });

    return {
      displayName: osidToDisplayName(taken.takingAgentId),
      agentId: agentIdFromTakingAgentId(taken.takingAgentId),
      takenId: taken.id,
      nextMission: {
        name: `${osidToDisplayName(taken.takingAgentId)}'s Phase II for ${taken.displayName.text}`,
        directives: newDirectives,
        numberItemsForDirectives: _.sumBy(newDirectives, 'quota')
      }
    }
  });


  // ====
  // case 2: there is a taken but it has no sections -- when would this be?
  // ====

  // ====
  // case 3: there are no takens at all for the students who didn't even open up the mission
  // the student gets all the directives that were in the original mission
  // =====
  // let studentsNotTaken = notTaken(results, roster);
  // console.log('studentsNotTaken', studentsNotTaken);
  // console.log('currentMission', mission);
  //
  // _.map(studentsNotTaken, rosterStudent => {
  //   let rosterStudentDisplayName = d2LDisplayNameToDisplayName(rosterStudent.DisplayName);
  //
  //   return {
  //     displayName: rosterStudentDisplayName,
  //     agentId: agentIdFromD2LRoster(rosterStudent),
  //     takenId: taken.id,
  //     nextMission: {
  //       name: `${rosterStudentDisplayName}'s Phase II for ${mission.displayName.text}`,
  //       directives: newDirectives,
  //       numberItemsForDirectives: _.sumBy(newDirectives, 'quota')
  //     }
  //   }
  // });


  return {
    students: studentRecommendations,
    // directives: targetOutcomes
  };
});
