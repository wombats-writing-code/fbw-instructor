
import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');

export const RECEIVE_UPDATE_MISSION = 'RECEIVE_UPDATE_MISSION'


export function updateMission(data, bankId) {

  return function(dispatch) {

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
