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

  let studentIdentifiers = _.map(roster, 'Identifier');

  let byStudent = _.reduce(studentIdentifiers, (result, id) => {

    _.each(followsFromMissions, (mission, mIdx) => {
      // group records by student first
      let recordsByStudent = _.groupBy(records[mIdx], 'user.Identifier');
      if (!recordsByStudent[id]) return;

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


      result[id] = {
        student: recordsByStudent[id][0].user,
        goals: _.concat((result[id] ? result[id].goals : []), notAchievedGoals),
        followsFromMissions: _.concat((result[id] ? result[id].followsFromMissions : []), mission.id),
      }
    });

    return result;
  }, {})

  // console.log('byStudent', byStudent);

  return _.values(byStudent)
});
