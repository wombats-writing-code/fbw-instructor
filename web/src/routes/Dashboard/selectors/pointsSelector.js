import { createSelector } from 'reselect'

import {getResults, getMapping, isTarget, notAchievedOnAttempt} from './common'



export const pointsSelector = createSelector([getResults], (results) => {
  if (!results) return null;

  let grades = _.reduce(results, (result, taken) => {
    console.log('taken', taken);
    let respondedTargetQuestions = _.filter(_.flatMap(taken.sections, 'questions'), isTarget);
    console.log('respondedTargetQuestions', respondedTargetQuestions);

    let percentCorrectPhaseI = 0;

    result.push({
      takingAgentId: taken.takingAgentId,
      points: _.random(50, 98)
    });

    return result;
  }, [])


  return grades

});
