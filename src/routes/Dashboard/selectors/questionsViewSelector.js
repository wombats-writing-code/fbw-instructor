import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getResults, getMapping, isTarget} from './common'

export const questionsViewSelector = createSelector([getResults, getMapping], (results, mapping) => {

  if (!results || !mapping) return null;

  let allQuestions = _.flatMap(results, 'questions');
  let targetQuestions =  _.filter(_.uniqBy(allQuestions, 'itemId'), (q) => isTarget(q));
  let targetOutcomes = _.compact(_.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => _.find(mapping.outcomes, {id: id})));

  // !temporary until i ask Cole
  targetOutcomes = [targetOutcomes[0], targetOutcomes[1]];

  console.log('questionsViewSelector results', results, ' questions', allQuestions, 'mapping', mapping);

  return {
    questions: allQuestions,
    directives: targetOutcomes
  };
});
