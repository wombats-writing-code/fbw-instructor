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

  let agentIds = _.map(results, 'takingAgentId');

  let studentsWithRecommendations = _.map(agentIds, (agentId) => {

    return {
      name: parseAgentId(agentId),
      nextMission: {
        directives: [],
        numberItemsForDirectives: Math.round(Math.random() * 10)
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
