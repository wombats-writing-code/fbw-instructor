
import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');

export const UPDATE_MISSION_FORM = 'UPDATE_MISSION_FORM'


export function updateMissionForm(data, bankId) {

  return function(dispatch) {
    console.log(data);
    dispatch({type: UPDATE_MISSION_FORM, data});
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
