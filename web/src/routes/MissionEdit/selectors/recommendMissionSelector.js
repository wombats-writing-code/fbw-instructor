import { createSelector } from 'reselect'
import _ from 'lodash'
import 'moment'
import 'moment-timezone'

import {getMapping} from '@wombats-writing-code/fbw-platform-common/selectors'
import {getRoster} from '@wombats-writing-code/fbw-platform-common/selectors/course'
import {isTarget} from '@wombats-writing-code/fbw-platform-common/selectors/mission'

const getRecords = (state) => {
  return _.map(state.editMission.newMission.followsFromMissions, missionId => {
    if (state.result.resultsByMission) {
      return state.result.resultsByMission[missionId];
    }
  })
}

// computes recommendations for all students
// As of Aug 1, 2017, it appears that this is not actually used
//   by any of the other components. It appears in ``MissionEditContainer``,
//   but the ``recommendations`` do not show up in the UI, nor does
//   there appear to be a way to "launch all phase II missions" there.
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

  // console.log('student', student, 'records', records, 'mission', mission);

  // if the mission has any records, they will appear here
  // will be null while fetching
  if (records) {
    let studentRecords = _.filter(records, r => r.user.Identifier === student.Identifier)

    // make sure we're only looking at the student's own records
    if (studentRecords && studentRecords.length > 0) {
      // if this student didn't even open phase I, they have no records.
      // Give them all the goals back.
      // group records by their section (goal)
      let bySection = _.groupBy(studentRecords, 'sectionIndex');

      // figure out which goals haven't been achieved
      let notAchievedGoals = _.reduce(mission.goals, (result, outcomeId, idx) => {
        // filter to get the records that correspond to target questions
        let targetRecords = _.filter(bySection[idx], record => isTarget(record.question));
        let achieved = _.every(targetRecords, r => r.responseResult && r.responseResult.question.response && r.responseResult.question.response.isCorrect);
        if (!achieved) result.push(outcomeId);

        return result;
      }, []);

      recommendation.goals = _.uniq(notAchievedGoals);

      // console.log('recommendation', recommendation.goals)
    } else {
      recommendation.goals = _.clone(mission.goals);
    }
  } else {
    recommendation.goals = _.clone(mission.goals);
  }

  return recommendation;
}
