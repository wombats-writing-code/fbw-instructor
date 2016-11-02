import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getResults, getMapping, isTarget, notAchievedWithinAttempts} from './common'
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
      nextMission: {
        name: `${parseAgentId(taken.takingAgentId)}'s TestFlight for ${taken.displayName.text}`,
        directives: newDirectives,
        numberItemsForDirectives: _.sumBy(newDirectives, 'quota')
      }
    }
  });
  console.log('results', results);
  // for

  return {
    students: studentsWithRecommendations,
    // directives: targetOutcomes
  };
});
