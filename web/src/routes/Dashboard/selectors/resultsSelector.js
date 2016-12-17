import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getResults, getMapping, isTarget, notAchievedOnAttempt} from './common'

export const makeResultsSelector = () => {
  return createSelector([getResults, getMapping], (results, mapping) => {
    console.log('creating selector for results', results, mapping)
    if (!results || !mapping) return null;

    // console.log('questionsViewSelector results', results, ' questions', allQuestions, 'mapping', mapping);

    let allQuestions = _.flatMap(_.flatMap(results, 'sections'), 'questions');
    let targetQuestions =  _.filter(_.uniqBy(allQuestions, 'itemId'), (q) => isTarget(q));
    let targetOutcomes = _.compact(_.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => _.find(mapping.outcomes, {id: id})));

    // console.log('allQuestions', allQuestions)
    // console.log('targetOutcomes', targetOutcomes)

    if (targetOutcomes.length === 0) return null;

    let allUniqueQuestions = _.uniqBy(allQuestions, 'itemId');
    let uniqueQuestionsByOutcome = _.groupBy(allUniqueQuestions, (q) => q.learningObjectiveIds[0]);

    // =====
    // build up a dictionary of results for our view by directive
    // =====
    let resultsByDirective = _.reduce( uniqueQuestionsByOutcome, (result, arrayQuestions, outcomeId) => {
      result[outcomeId] = result[outcomeId] || [];
      result[outcomeId] = _.concat(result[outcomeId], _.map(arrayQuestions, (question) => {
        let {notAchieved, total} = notAchievedOnAttempt(question.itemId, results, 1);

        return {
          numStudentsNotAchieved: notAchieved.length,
          numStudentsAttempted: total.length,
          questionId: question.itemId,
          questionText: question.text.text,
        }
      }));

      return result;
    }, {});

    // console.log('resultsByDirective', resultsByDirective)

    let resultsByQuestion = _.reduce(allUniqueQuestions, (result, question) => {
      // console.log('each unique question', question)
      let {notAchieved, total} = notAchievedOnAttempt(question.itemId, results, 1);

      result[question.itemId] = result[question.itemId] || {
        studentsNotAchieved: notAchieved,
        studentsAchieved: _.difference(total, notAchieved),
      };

      return result;

    }, {});

    // sort the inner questions and attach flag
    _.forOwn(resultsByDirective, (results, directiveId) => {
      let totalNotAchieved = _.sum(_.map(results, (r) => _.parseInt(r.numStudentsNotAchieved)));
      let total = _.sum(_.map(results, (r) => _.parseInt(r.numStudentsAttempted)));

      resultsByDirective[directiveId] = {
        questions: _.orderBy(results, ['numStudentsNotAchieved'], ['desc']),
        warning: totalNotAchieved >= total / 2
      };
    });

    // TODO: compute unique students who actually had a response
    let totalResponded = 0;

    // console.log('resultsByDirective', resultsByDirective);
    // console.log('sorted', sorted);

    return {
      results,
      totalResponded,
      resultsByDirective,
      resultsByQuestion,
      questions: allQuestions,
      directives: targetOutcomes
    };
  });
}
