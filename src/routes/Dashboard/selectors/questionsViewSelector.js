import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getResults, getMapping, isTarget, notAchievedOnAttempt} from './common'

export const questionsViewSelector = createSelector([getResults, getMapping], (results, mapping) => {

  if (!results || !mapping) return null;

  // console.log('questionsViewSelector results', results, ' questions', allQuestions, 'mapping', mapping);

  let allQuestions = _.flatMap(results, 'questions');
  let targetQuestions =  _.filter(_.uniqBy(allQuestions, 'itemId'), (q) => isTarget(q));
  let targetOutcomes = _.compact(_.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => _.find(mapping.outcomes, {id: id})));

  // !temporary until i ask Cole
  // targetOutcomes = [targetOutcomes[0], targetOutcomes[1]];

  let allUniqueQuestions = _.uniqBy(allQuestions, 'itemId');
  let uniqueQuestionsByOutcome = _.groupBy(allUniqueQuestions, (q) => q.learningObjectiveIds[0]);

  let resultsByDirective = _.reduce( uniqueQuestionsByOutcome, (result, arrayQuestions, outcomeId) => {
    let question = arrayQuestions[0];
    // hmmm: note to self: there could be more than one question per directive...we should show an array of arrays

    let {notAchieved, total} = notAchievedOnAttempt(question.itemId, results, 1);

    result[outcomeId] = result[outcomeId] || [];
    result[outcomeId].push({
      numStudentsNotAchieved: notAchieved.length,
      numStudentsAttempted: total.length,
      questionId: question.itemId,
      questionText: question.text.text,
    });

    return result;
  }, {});

  // console.log('resultsByDirective', resultsByDirective);

  return {
    resultsByDirective,
    questions: allQuestions,
    directives: targetOutcomes
  };
});
