import { createSelector } from 'reselect'

import {getMapping, getPhaseIResults, getPhaseIIResults} from 'fbw-platform-common/selectors'
import {agentIdFromTakingAgentId} from 'fbw-platform-common/selectors/login'
import {isTarget} from 'fbw-platform-common/selectors/mission'
import {extractDisplayName} from 'fbw-platform-common/d2lutils'
import {notAchievedOnAttempt} from './common'


export const pointsSelector = createSelector([
  getPhaseIResults, getPhaseIIResults
], (phaseIResults, phaseIIResults) => {

  if (_.every(_.concat(phaseIResults, phaseIIResults), _.isUndefined)) return null;

  let _resultsbyStudent = _.noop;

  // =====
  // calculate points for Phase I
  // =====
  let phaseIGradesByStudent = _resultsByStudent(phaseIResults || []) || {};

  // ====
  // calculate points for Phase II
  // ====
  let phaseIIGradesByStudent = _resultsbyStudent(phaseIIResults || []) || {};

  // get all students. a student can appear in Phase I but not Phase II, and vice versa, or both.
  let allStudents = _.uniq(_.concat(_.keys(phaseIGradesByStudent), _.keys(phaseIIGradesByStudent)));

  console.log('phaseIGradesByStudent', phaseIGradesByStudent);
  console.log('phaseIIGradesByStudent', phaseIIGradesByStudent);

  // ===
  // combine Phase I and Phase II points to get final grade
  // ====
  let grades = _.reduce(allStudents, (result, takenId) => {

    let phaseIResult = phaseIGradesByStudent[takenId];
    let phaseIPercent = phaseIResult ? phaseIResult.percentCorrect : 0;

    let phaseIIResult = phaseIIGradesByStudent[takenId];
    let phaseIIPercent = phaseIIResult ? phaseIIResult.percentCorrect : 0;

    let maxEarnable = (100 - phaseIPercent) * .8;      // the max a student can earn in Phase II is 80% of what they lost in Phase I

    result.push(
      {
        takingAgentId: extractDisplayName(agentIdFromTakingAgentId(takenId)),
        points: phaseIPercent + (phaseIIPercent * maxEarnable)
      }
    );

    return result;
  }, []);

  return grades
});

// _resultsByStudent: given an array of takens, return dictionary of points by student
function _resultsByStudent(takens) {
  let resultsbyStudent = _.reduce(takens, (result, taken) => {
    let targetQuestions = _.filter(_.flatMap(taken.sections, 'questions'), isTarget);
    // console.log('targetQuestions', targetQuestions);
    // console.log('taken', taken)

    // iterate through the Targets to see how many each student got correct
    let numberCorrect = _.reduce(targetQuestions, (sum, question) => {
      if (question.response && question.response.isCorrect) {
        sum++;
      }

      return sum;
    }, 0);

    let percentCorrect = (numberCorrect / targetQuestions.length) * 100;

    result[taken.takingAgentId] = {
      takingAgentId: taken.takingAgentId,
      percentCorrect: percentCorrect
    };

    return result;
  }, {});

  return resultsbyStudent;
}
