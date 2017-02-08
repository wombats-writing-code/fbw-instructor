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
import {findBankLibrary} from 'fbw-platform-common/utilities'
import {notAchievedOnAttempt, notTaken} from './common'


export const recommendMissionSelector = createSelector(
  [
    state => state.result.phaseIResults,
    state => state.mission.currentMission,
    // state => state.mission.currentMissionSections,
    state => state.bank.currentBank, // used for finding the itemBankID for case 2
    getMapping,
    getRoster
  ]
  , (results, mission, currentBank, mapping, roster) => {

  if (!results || !mapping) return null;

  // console.log('mission in recommendMissionSelector', mission);
  // console.log('missionSections in recommendMissionSelector', missionSections);

  // ====
  // case 1: the taken has sections
  // student gets a directive again if they didn't answer every Target correctly
  // ====
  let studentsTakenRecommendations = _.map(results, (taken) => {
    let directives = composeDirectives(taken.sections, currentBank);

    return {
      displayName: osidToDisplayName(taken.takingAgentId),
      agentId: agentIdFromTakingAgentId(taken.takingAgentId),
      takenId: taken.id,
      nextMission: {
        name: `${osidToDisplayName(taken.takingAgentId)}'s Phase II for ${taken.displayName.text}`,
        directives: directives,
        numberItemsForDirectives: _.sumBy(directives, 'quota')
      }
    }
  });

  // ====
  // case 2: there are no takens at all for the students who didn't even open up the mission
  // the student gets all the directives that were in the original mission
  // =====
  let studentsNotTaken = notTaken(results, roster);
  console.log('studentsNotTaken', studentsNotTaken);
  // console.log('currentMission', mission);

  let studentsNotTakenRecommendations = _.map(studentsNotTaken, rosterStudent => {
    let rosterStudentDisplayName = d2LDisplayNameToDisplayName(rosterStudent.DisplayName);
    let directives = composeDirectives(mission.sections, currentBank);

    return {
      displayName: rosterStudentDisplayName,
      agentId: agentIdFromD2LRoster(rosterStudent),
      takenId: mission.assessmentOfferedId,            // per Cole and Luwen's discussion, use the original mission's offered Id
      nextMission: {
        name: `${rosterStudentDisplayName}'s Phase II for ${mission.displayName.text}`,
        directives: directives,
        numberItemsForDirectives: _.sumBy(directives, 'quota')
      }
    }
  });


  return {
    students: _.concat(studentsNotTakenRecommendations, studentsTakenRecommendations),
    // directives: targetOutcomes
  };
});

function composeDirectives(sections, bank) {
  let directives = _.reduce(sections, function (directivesResult, section) {
    let targetQuestions = section.questions ? _.filter(section.questions, isTarget) : section.childIds;
    let numberRight = _.reduce(targetQuestions, function(result, question) {
      if (question.response && question.response.isCorrect) result++;
      return result;
    }, 0);

    // console.log('num right', numberRight, 'total', targetQuestions.length)
    if (numberRight < targetQuestions.length) {
      directivesResult.push({
        learningObjectiveId: section.learningObjectiveId,
        quota: targetQuestions.length,
        waypointQuota: 1,
        itemBankId: section.questions ? section.questions[0].bankId : findBankLibrary(bank.id, [bank]),
        minimumProficiency: section.minimumProficiency
      })
    }

    return directivesResult;
  }, []);

  return directives;
}
