import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getResults, getMapping, isTarget, notAchievedOnAttempt} from './common'
import {itemsForDirectivesSelector} from '../../MissionControl/selectors/'

const parseAgentId = (agentId) => {
  if (!agentId) return '';

  return agentId.split('%3A')[1].split('%25')[0];
}

export const spawnViewSelector = createSelector([getResults, getMapping], (results, mapping) => {

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
          if (question.responses[0]) {
            if (question.responses[0].isCorrect) {
              return question
            }
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
    })

    return {
      name: parseAgentId(taken.takingAgentId),
      takenId: taken.id,
      nextMission: {
        name: `${parseAgentId(taken.takingAgentId)}'s Phase II for ${taken.displayName.text}`,
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
