import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getMapping, isTarget, notAchievedOnAttempt} from './common'
import {itemsForDirectivesSelector} from '../../../components/MissionForm/selectors/'

const parseAgentId = (agentId) => {
  if (!agentId) return '';

  return agentId.split('%3A')[1].split('%25')[0];
}

export const parseAgentIdIdentifier = (agentId) => {
  if (!agentId) return '';

  // need to call this twice to convert %25 => %, then %40 => @
  return decodeURIComponent(decodeURIComponent(agentId.split('%3A')[1].split('%40')[0]));
}

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
          if (question.responses && question.responses[0]) {
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
    });

    return {
      name: parseAgentId(taken.takingAgentId),
      agentId: parseAgentIdIdentifier(taken.takingAgentId),
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
