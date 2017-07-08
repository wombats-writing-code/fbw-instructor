import { createSelector } from 'reselect'
import _ from 'lodash'
import moment from 'moment'
import 'moment-timezone'

import {getMapping} from 'fbw-platform-common/selectors'
import {isTarget} from 'fbw-platform-common/selectors/mission'
import {getRoster} from 'fbw-platform-common/selectors/course'
import {missionConfig} from 'fbw-platform-common/reducers/Mission'

/**
  computes the number of points students got on a mission
*/
export const computeGrades = (mission, records, roster) => {
  if (!mission) {
    throw new TypeError('mission must be non-null in 1st arg of computeGrades');
  }

  if (!roster) {
    throw new TypeError('roster must be non-null');
  }

  let groupedByStudent = _.groupBy(records, 'user.Identifier');
  let studentsOpenedIdentifiers = _.uniq(_.map(records, 'user.Identifier'));
  let studentsNotOpenedIdentifers = _.difference(_.map(roster, 'Identifier'), studentsOpenedIdentifiers);
  // console.log('studentsNotOpenedIdentifers', studentsNotOpenedIdentifers)
  // console.log('records', records)
  // console.log('studentsOpened', _.uniq(_.map(records, 'user')))

  // TODO: note that this block will always run,
  // because of the way we're redoing points grading
  let grades = _.reduce(groupedByStudent, (result, studentRecords, userIdentifier) => {
      let targets = _.filter(studentRecords, r => isTarget(r.question));
      // console.log('studentRecords', studentRecords)
      let createdAt = _.map(studentRecords, r => moment(r.createdAt).valueOf());
      let updatedAt = _.map(_.compact(_.map(studentRecords, 'responseResult.updatedAt')), t => moment(t).valueOf());
      let timeStamps = _.concat(createdAt, updatedAt);

      let completed = _.every(studentRecords, r => r.responseResult && r.responseResult.question.responded);

      // console.log('completed', completed)

      let grade = {
        points: pointsEarned(_.map(targets, 'responseResult.question')),
        user: studentRecords[0].user,
        firstActive: moment(_.min(createdAt)).format('h:mma ddd M/D'),
        lastActive: moment(_.max(timeStamps)).format('h:mma ddd M/D'),
        // completed: _.toString(completed)
        completed: completed ? "True" : ''
      }

      result.push(grade);

      return result;
    }, []);

    let studentsNotOpenedGrades = _.map(studentsNotOpenedIdentifers, id => {
      return {
        points: null,
        user: _.find(roster, {Identifier: id}),
        firstActive: '---',
        lastActive: '---',
        completed: null
      }
    })

    grades = _.concat(grades, studentsNotOpenedGrades);


  // console.log('grades for mission', mission, grades)

  return grades;
}

export const pointsEarned = (questions) => {
  let numberCorrect = _.reduce(questions, (sum, question) => {
    if (question && question.response && question.response.isCorrect) {
      sum++;
    }

    return sum;
  }, 0);

  let percentCorrect = _.round((numberCorrect / questions.length) * 100, 1);
  return percentCorrect;
}

export const parseResults = (records, roster, mission) => {
  if (!records || !roster) return;

  let groupedByStudent = _.groupBy(records, 'user.Identifier');
  let studentsOpenedIdentifiers = _.uniq(_.map(records, 'user.Identifier'));
  let studentsNotOpenedIdentifers = _.difference(_.map(roster, 'Identifier'), studentsOpenedIdentifiers);

  // console.log('records', records);
  // console.log('studentsOpenedIdentifiers', studentsOpenedIdentifiers);
  // console.log('studentsNotOpenedIdentifers', studentsNotOpenedIdentifers)
  // console.log('roster', _.map(roster, 'Identifier'))
  let incorrectResponsesByOutcome = getIncorrectResponsesByOutcome(records, studentsNotOpenedIdentifers);

  // for each outcome, we need to add 1 to the tally of incorrect responses,
  // for each student who hasn't opened the mission
  // but ONLY for target outcomes
  // incorrectResponsesByOutcome = _.reduce(incorrectResponsesByOutcome, (result, responses))

  // console.log('incorrectResponsesByOutcome', incorrectResponsesByOutcome)

  // =====
  // calculate what percent of the class got each outcome incorrect
  // =====
  let fractionIncorrectStudentsByOutcome = _.reduce(incorrectResponsesByOutcome, (result, responses, outcomeId) => {
    let uniqueStudentsForOutcome = _.uniqBy(responses, 'user.Identifier');

    let totalStudentsIncorrectForOutcome = uniqueStudentsForOutcome.length;
    if (mission.goals.indexOf(outcomeId) > -1) {
      totalStudentsIncorrectForOutcome += studentsNotOpenedIdentifers.length;
    }

    // console.log('uniqueStudentsForOutcome', uniqueStudentsForOutcome)
    // console.log('totalStudentsIncorrectForOutcome', totalStudentsIncorrectForOutcome)

    result[outcomeId] = {
      fractionIncorrect: totalStudentsIncorrectForOutcome / roster.length
    }

    return result;
  }, {});

  // console.log('fractionIncorrectStudentsByOutcome', fractionIncorrectStudentsByOutcome)

  // bad outcomes are outcomes where more than 50% of the class got wrong
  let badOutcomes = _.pickBy(incorrectResponsesByOutcome, (responses, outcomeId) => {
    return fractionIncorrectStudentsByOutcome[outcomeId].fractionIncorrect >= .5
  });

  // medium outcomes are outcomes where >25% of class but < 50% of class got wrong
  let mediumOutcomes = _.pickBy(incorrectResponsesByOutcome, (responses, outcomeId) => {
    return fractionIncorrectStudentsByOutcome[outcomeId].fractionIncorrect >= .25 && fractionIncorrectStudentsByOutcome[outcomeId].fractionIncorrect < .5
  });

  // good outcomes are outcomes where < 25 % of class got wrong
  let goodOutcomes = _.pickBy(incorrectResponsesByOutcome, (responses, outcomeId) => {
    return fractionIncorrectStudentsByOutcome[outcomeId].fractionIncorrect < .25;
  });

  let reviewOutcomes = _.filter(incorrectResponsesByOutcome, (responses, outcomeId) => {
    return responses.length > 0 &&
            fractionIncorrectStudentsByOutcome[outcomeId].fractionIncorrect >= .5 &&
            mission.goals.indexOf(outcomeId);
  });

  // console.log('reviewOutcomes', reviewOutcomes)


  return {
    reviewOutcomes,
    badOutcomes,
    mediumOutcomes,
    goodOutcomes,
    studentsOpened: _.map(studentsOpenedIdentifiers, id => _.find(roster, {Identifier: id})),
    studentsNotOpened: _.map(studentsNotOpenedIdentifers, id => _.find(roster, {Identifier: id})),
  };
}

// ====
// get incorrect responses for each outcome
// iterate through every unique outcome, and compute how many *responses* to that outcome were incorrect
// (per faculty request, a no response is counted as incorrect)
// ====
export const getIncorrectResponsesByOutcome = (records) => {
  let uniqueOutcomes = _.uniq(_.map(records, 'outcome'));
  let incorrectResponsesByOutcome = _.reduce(uniqueOutcomes, (result, id) => {
    result[id] = _.filter(records, r => {
      if (r.outcome === id) {
        // no responses are counted as incorrect
        if (!r.responseResult || !r.responseResult.question.response) {
          return true;
        }

        // if there is a response
        let response = r.responseResult && r.responseResult.question.response;

        return response.isCorrect === false;
      }
    });

    return result;
  }, {});

  return incorrectResponsesByOutcome;
}


// ====
// DEPRECATED
// compute responses by question
// iterate through every unique question, and compute how many *responses* were incorrect
// note that a single student can generate multiple responses (by repeatedly getting Waypoint questions wrong)
// ====
export const getIncorrectResponsesByQuestion = (records) => {
  let uniqueQuestions = _.uniq(_.map(records, 'question.id'));
  let incorrectResponsesByQuestion = _.reduce(uniqueQuestions, (result, id) => {
    result[id] = _.filter(records, r => {
      let response = r.question.id === id && r.responseResult && r.responseResult.question.response;
      if (response) {
        return response.isCorrect === false;
      }
    });

    return result;
  }, {});

  // filter out questions with 0 responses
  // let incorrectQuestionsResponses = _.filter(_.values(incorrectResponsesByQuestion), responses => responses.length > 0);

  return incorrectResponsesByQuestion;
}
