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

    console.log('resultsSelector results', results, 'mapping', mapping);
    if (!results || !mapping) return null;

    // console.log('questionsViewSelector results', results, ' questions', allQuestions, 'mapping', mapping);

    let allQuestions = _.flatMap(_.flatMap(results, 'sections'), 'questions');
    let targetQuestions =  _.filter(_.uniqBy(allQuestions, 'itemId'), (q) => isTarget(q));
    let targetOutcomes = _.compact(_.map(_.uniq(_.flatMap(targetQuestions, 'learningObjectiveIds')), (id) => _.find(mapping.outcomes, {id: id})));

    // console.log('allQuestions', allQuestions)
    // console.log('targetOutcomes', targetOutcomes)

    // =====
    // computes who did not open up the mission
    let studentsNotTaken = notTaken(results, roster);
    // console.log('notTaken', notTaken)
    // ======

    // ====
    let targetResultsByDirectiveIndex = _.reduce(targetOutcomes, (result, directive, idx) => {

      // filter out the target questions that apply to this directive
      let targetsForDirective = _.filter(targetQuestions, q => q.learningObjectiveIds.indexOf(directive.id) > -1);

      // assign to the result some statistics
      result[idx] = _.map(targetsForDirective, (target) => {
        return _.assign({},
          target,
          notAchievedOnAttempt(target.itemId, results, 1),
          // this block below is temporary.
          // what we ideally want is 'responded = true' and the solution to show
          {
            responded: false,
            response: target.response || {
              feedback: {
                text: target.response && target.response.feedback ? target.response.feedback : '',
              },
              choiceIds: []
            },
            isCorrect: null
          },
        );
      });

      // console.log('directive index idx:', result[idx]);

      return result;
    }, {});

    return {
      results,
      studentsNotTaken,
      targetResultsByDirectiveIndex,
      directives: targetOutcomes,
      // directiveIndicators
    };
  });
}
