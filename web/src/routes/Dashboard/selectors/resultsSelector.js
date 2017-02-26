import { createSelector } from 'reselect'
import _ from 'lodash'
import 'moment'
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

  if (!records) {
    return;
    // throw new TypeError('records must be an array, even if an empty one');
  }

  if (!roster) {
    throw new TypeError('roster must be non-null');
  }

  let groupedByStudent = _.groupBy(records, 'user.Identifier');
  let studentsOpenedIdentifiers = _.uniq(_.map(records, 'user.Identifier'));
  let studentsNotOpenedIdentifers = _.difference(_.map(roster, 'Identifier'), studentsOpenedIdentifiers);

  let phaseIGrades;
  if (mission.type === missionConfig.PHASE_I_MISSION_TYPE) {
    phaseIGrades = _.reduce(groupedByStudent, (result, records, userIdentifier) => {
      let targets = _.filter(records, r => isTarget(r.question));
      // console.log('records', records)

      let grade = {
        points: pointsEarned(_.map(targets, 'responseResult.question')),
        user: records[0].user,
        status: '',
      }

      result.push(grade);

      return result;
    }, []);

    let studentsNotOpenedGrades = _.map(studentsNotOpenedIdentifers, id => {
      return {
        points: null,
        user: _.find(roster, {Identifier: id}),
        status: '---'
      }
    })

    phaseIGrades = _.concat(phaseIGrades, studentsNotOpenedGrades);
  }



  // console.log('phaseIGrades', phaseIGrades)

  // for phase II type missions
  return phaseIGrades;
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

export const parseResults = (records, roster) => {
  if (!records || !roster) return;

  let groupedByStudent = _.groupBy(records, 'user.Identifier');
  let studentsOpenedIdentifiers = _.uniq(_.map(records, 'user.Identifier'));
  let studentsNotOpenedIdentifers = _.difference(_.map(roster, 'Identifier'), studentsOpenedIdentifiers);

  console.log('records', records);
  console.log('studentsOpenedIdentifiers', studentsOpenedIdentifiers);
  // console.log('studentsNotOpenedIdentifers', studentsNotOpenedIdentifers)
  // console.log('roster', _.map(roster, 'Identifier'))

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

  // console.log('incorrectResponsesByQuestion', incorrectResponsesByQuestion)

  let incorrectQuestionsResponses = _.filter(_.values(incorrectResponsesByQuestion), responses => responses.length > 0);

  return {
    // this is an array of an array of records for each question, sorted in descending order of incorrect responses
    incorrectQuestionsRanked: _.take(_.orderBy(incorrectQuestionsResponses, array => array.length, ['desc']), 3),
    studentsOpened: _.map(studentsOpenedIdentifiers, id => _.find(roster, {Identifier: id})),
    studentsNotOpened: _.map(studentsNotOpenedIdentifers, id => _.find(roster, {Identifier: id})),
  };
}
