import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getMapping} from 'fbw-platform-common/selectors'
import {isTarget} from 'fbw-platform-common/selectors/mission'
import {agentDisplayName, agentIdFromTakingAgentId} from 'fbw-platform-common/selectors/login'
import {notAchievedOnAttempt} from './common'

export const recommendMissionSelector = createSelector(
  [
    state => state.mission.phaseIResults,
    getMapping
  ]
  , (results, mapping) => {

  if (!results || !mapping) return null;

  let studentsWithRecommendations = _.map(results, (taken) => {
    // let's say that they have to re-take a directive if
    // they did not meet the minimumProficiency for target questions
    // TODO: if the taken has no sections, need to just copy the
    // original mission -- the student didn't get the questions or try them
    let newDirectives = [];


    _.each(taken.sections, function (section) {
      let targetQuestions = _.filter(section.questions, isTarget),
        numberRight = _.compact(_.map(targetQuestions, function (question) {
          if (question.response && question.response.isCorrect) {
              return question
          }
        })).length;
      if (numberRight < parseInt(section.minimumProficiency)) {
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
      displayName: agentDisplayName(taken.takingAgentId),
      agentId: agentIdFromTakingAgentId(taken.takingAgentId),
      takenId: taken.id,
      nextMission: {
        name: `${agentDisplayName(taken.takingAgentId)}'s Phase II for ${taken.displayName.text}`,
        directives: newDirectives,
        numberItemsForDirectives: _.sumBy(newDirectives, 'quota')
      }
    }
  });
  // for

  return {
    students: studentsWithRecommendations,
    // directives: targetOutcomes
  };
});
