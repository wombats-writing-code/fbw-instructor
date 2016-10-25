
import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');


export function updateAssessmentOptimistic(data) {
  return {type: UPDATE_ASSESSMENT, data };
}

export function updateAssessment(data, bankId) {

  return function(dispatch) {
    dispatch(updateAssessmentOptimistic(data));

    var updateSectionParams = {
      data: {
      },
      method: 'PUT',
      path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
    };
    _.assign(updateSectionParams.data, data.params);

    return qbankFetch(updateSectionParams)
    .then((res) => res.json())
    .then((updatedAssessment) => {
      // return the newly updated assessment
      data.callback(updatedAssessment);
    })
    .catch((error) => {
      console.log('error updating assessment');
    })
    .done();
  }
}
