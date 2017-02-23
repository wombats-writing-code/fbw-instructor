import { createSelector } from 'reselect'
import _ from 'lodash'
import 'moment'
import 'moment-timezone'

import {getMapping, getPhaseIResults, getPhaseIIResults} from 'fbw-platform-common/selectors'
import {isTarget} from 'fbw-platform-common/selectors/mission'
import {getRoster} from 'fbw-platform-common/selectors/course'
import {notAchievedOnAttempt, notTaken} from './common'


export const parseResults = createSelector([
  state => state.mission.currentMission ? state.result.resultsByMission[state.mission.currentMission.id] : null,
  getRoster,
  ], (records, roster) => {

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
});
