import { createSelector } from 'reselect'
import 'lodash'
import 'moment'
import 'moment-timezone'

import {getMapping, getPhaseIResults, getPhaseIIResults} from 'fbw-platform-common/selectors'
import {isTarget} from 'fbw-platform-common/selectors/mission'
import {getRoster} from 'fbw-platform-common/selectors/bank'
import {notAchievedOnAttempt, notTaken} from './common'

/**
  this selector analyzes Phase I or PhaseII results for a mission

*/

export const makeResultsSelector = () => {
  return createSelector(
    [
      (state, ownProps) => ownProps.missionType === 'Phase I' ? getPhaseIResults(state) : getPhaseIIResults(state),
      getMapping,
      getRoster
    ],
    (results, mapping, roster) => {

    console.log('resultsSelector', results, 'mapping', mapping);
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

    // sort the inner questions and attach flag
    _.forOwn(resultsByDirective, (results, directiveId) => {
      let totalNotAchieved = _.sum(_.map(results, (r) => _.parseInt(r.numStudentsNotAchieved)));
      let total = _.sum(_.map(results, (r) => _.parseInt(r.numStudentsAttempted)));

      resultsByDirective[directiveId] = {
        questions: _.orderBy(results, ['numStudentsNotAchieved'], ['desc']),
        warning: totalNotAchieved >= total / 2
      };
    });

    // console.log('resultsByDirective', resultsByDirective)

    let resultsByQuestion = _.reduce(allUniqueQuestions, (result, question) => {
      let {notAchieved, total} = notAchievedOnAttempt(question.itemId, results, 1);
      let outcome = _.find(mapping.outcomes, o => o.id === question.learningObjectiveIds[0]);
      // if (!outcome) {
      //   console.log('each unique question', question)
      //   console.log('its outcome', outcome)
      // }

      result[question.itemId] = result[question.itemId] || {
        question,
        outcome,
        studentsNotAchieved: notAchieved,
        studentsAchieved: _.difference(total, notAchieved),
      };

      return result;
    }, {});

    // =====
    // computes who did not open up the mission
    let studentsNotTaken = notTaken(results, roster);

    // console.log('notTaken', notTaken)
    // ======

    // console.log('resultsByDirective', resultsByDirective);
    // console.log('sorted', sorted);

    return {
      results,
      studentsNotTaken,
      resultsByDirective,
      resultsByQuestion,
      questions: allQuestions,
      directives: targetOutcomes,
      // directiveIndicators
    };
  });
}
