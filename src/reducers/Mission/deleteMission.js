import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');

export function deleteAssessmentOptimistic(data) {
  return { type: DELETE_ASSESSMENT, data };
}

export function deleteAssessment(data, bankId) {

  return function(dispatch) {
    dispatch(deleteAssessmentOptimistic(data));

    return qbankFetch(deleteOfferedParams)
    .then( (assessmentOfferedData) => {
      let deleteAssessmentParams = {
        method: 'DELETE',
        path: `assessment/banks/${currentBankId}/assessments/${data.assessmentId}`
      };

      return qbankFetch(deleteAssessmentParams);
    })
    .then( (assessmentData) => {
      let updatedAssessments = _.filter(_assessments, (assessment) => {
        return assessment.id !== data.assessmentId;
      });
    })
    .catch((error) => {
      console.log('error deleting an assessment + offered');
      console.log(error);
    })
    .done();
  }
}
