
import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');

export const UPDATE_MISSION = 'UPDATE_MISSION'

export function updateMissionOptimistic(mission) {
  return {type: UPDATE_MISSION, mission };
}

export function updateMission(data, bankId) {

  return function(dispatch) {
    dispatch(updateMissionOptimistic(data));

    // var updateSectionParams = {
    //   data: {
    //   },
    //   method: 'PUT',
    //   path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
    // };
    // _.assign(updateSectionParams.data, data.params);
    //
    // return qbankFetch(updateSectionParams)
    // .then((res) => res.json())
    // .then((updatedMission) => {
    //   // return the newly updated assessment
    //   data.callback(updatedMission);
    // })
    // .catch((error) => {
    //   console.log('error updating assessment');
    // })
    // .done();
  }
}
