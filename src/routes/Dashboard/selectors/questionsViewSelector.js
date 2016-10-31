import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getResults, getMapping, isTarget, notAchievedWithinAttempts} from './common'

export const questionsViewSelector = createSelector([getResults, getMapping], (results, mapping) => {

  if (!results || !mapping) return null;

  // console.log('questionsViewSelector results', results, ' questions', allQuestions, 'mapping', mapping);

  let allQuestions = _.flatMap(results, 'questions');
  let targetQuestions =  _.filter(_.uniqBy(allQuestions, 'itemId'), (q) => isTarget(q));
  let targetOutcomes = _.compact(_.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => _.find(mapping.outcomes, {id: id})));

  if (targetOutcomes.length === 0) return null;

  // !temporary until i ask Cole
  // targetOutcomes = [targetOutcomes[0], targetOutcomes[1]];

  let allUniqueQuestions = _.uniqBy(allQuestions, 'itemId');
  let uniqueQuestionsByOutcome = _.groupBy(allUniqueQuestions, (q) => q.learningObjectiveIds[0]);

  // build up a dictionary of results by directive
  let resultsByDirective = _.reduce( uniqueQuestionsByOutcome, (result, arrayQuestions, outcomeId) => {
    // hmmm: note to self: there could be more than one question per directive...we should show an array of arrays

    result[outcomeId] = result[outcomeId] || [];
    result[outcomeId] = _.concat(result[outcomeId], _.map(arrayQuestions, (question) => {
      let {notAchieved, total} = notAchievedWithinAttempts(question.itemId, results, 1);

      return {
        numStudentsNotAchieved: notAchieved.length,
        numStudentsAttempted: total.length,
        questionId: question.itemId,
        questionText: question.text.text,
      }
    }));

    return result;
  }, {});

  // console.log('resultsByDirective', resultsByDirective);

  return {
    resultsByDirective,
    questions: allQuestions,
    directives: targetOutcomes
  };
});
