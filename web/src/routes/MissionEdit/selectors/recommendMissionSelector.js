import { createSelector } from 'reselect'
import _ from 'lodash'
import 'moment'
import 'moment-timezone'

import {getMapping} from 'fbw-platform-common/selectors'
import {getRoster} from 'fbw-platform-common/selectors/course'
import {isTarget} from 'fbw-platform-common/selectors/mission'

const getRecords = (state) => {
  return _.map(state.editMission.newMission.followsFromMissions, missionId => {
    if (state.result.resultsByMission) {
      return state.result.resultsByMission[missionId];
    }
  })
}

// computes recommendations for all students
export const computeRecommendations = createSelector([
  state => _.map(state.editMission.newMission.followsFromMissions, missionId => _.find(state.mission.missions, {id: missionId})),
  getRecords,
  getRoster
  ],
  (followsFromMissions, records, roster) => {

  if (!followsFromMissions) {
    // throw new TypeError('followsFromMissions needs to be a non-null array of missions')
    return null;
  }

  if (!records) {
    // throw new TypeError('records must be an array of arrays')
    return null;
  }

  // console.log('computeRecommendations', followsFromMissions);
  // console.log('records', records);
  // console.log('followsFromMissions', followsFromMissions);


  let studentIdentifiers = _.map(roster, 'Identifier');
  let studentsOpenedIdentifiers = _.uniq(_.map(records, 'user.Identifier'));

  let byStudent = _.reduce(studentIdentifiers, (result, id) => {
    _.each(followsFromMissions, (mission, mIdx) => {
      // group records by student first
      let recordsByStudent = _.groupBy(records[mIdx], 'user.Identifier');

      // if the student didn't even open the mission,
      // give them every outcome again
      if (!recordsByStudent[id]) {
        result[id] = {
          student: _.find(roster, {Identifier: id}),
          goals: _.flatMap(followsFromMissions, 'goals'),
          followsFromMissions: result
        }
        return result;
      }

      // group records by their section (goal)
      let bySection = _.groupBy(recordsByStudent[id], 'sectionIndex');

      // console.log('recordsByStudent', recordsByStudent, mIdx)
      // console.log('bySection[id]', recordsByStudent[id], id)

      // figure out which goals haven't been achieved
      let notAchievedGoals = _.reduce(mission.goals, (result, outcomeId, idx) => {
        // filter to get the records that correspond to target questions
        let targetRecords = _.filter(bySection[idx], record => isTarget(record.question));
        let achieved = _.every(bySection[idx], r => r.responseResult && r.responseResult.question.response && r.responseResult.question.response.isCorrect);
        if (!achieved) result.push(outcomeId);

        return result;
      }, []);

      let goals = _.uniq(_.concat((result[id] ? result[id].goals : []), notAchievedGoals));

      result[id] = {
        student: recordsByStudent[id][0].user,
        goals: goals,
        followsFromMissions: _.concat((result[id] ? result[id].followsFromMissions : []), mission.id),
      }
    });

    return result;
  }, {})

  // console.log('byStudent', byStudent);

  return _.values(byStudent)
});

// computes Phase II recommendation for a single student
export const computeRecommendation = (student, records, mission) => {
  let recommendation = {
    student,
    followsFromMissions: [mission.id]
  };

  // if the student has opened the mission
  if (records && records.length > 0) {

    // make sure we're only looking at the student's own records
    let studentRecords = _.filter(records, r => r.user.Identifier === student.Identifier)
    // console.log('studentRecords', studentRecords);

    // group records by their section (goal)
    let bySection = _.groupBy(studentRecords, 'sectionIndex');

    // figure out which goals haven't been achieved
    let notAchievedGoals = _.reduce(mission.goals, (result, outcomeId, idx) => {
      // filter to get the records that correspond to target questions
      let targetRecords = _.filter(bySection[idx], record => isTarget(record.question));
      let achieved = _.every(bySection[idx], r => r.responseResult && r.responseResult.question.response && r.responseResult.question.response.isCorrect);
      if (!achieved) result.push(outcomeId);

      return result;
    }, []);

    recommendation.goals = _.uniq(notAchievedGoals);

    // console.log('recommendation', recommendation.goals)

  } else {
    recommendation.goals = _.clone(mission.goals);
  }

  return recommendation;
}
