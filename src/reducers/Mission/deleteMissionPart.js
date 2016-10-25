
import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');


export function deleteAssessmentPartOptimistic(data) {
  return {type: DELETE_ASSESSMENT_PART, data };
}

export function deleteAssessmentPart(data, bankId) {

  return function(dispatch) {
    dispatch(deleteAssessmentPartOptimistic(data));

    var deleteSectionParams = {
      data: {
        sections: {}
      },
      method: 'PUT',
      path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
    };
    _.assign(deleteSectionParams.data.sections, data.params);

    return qbankFetch(deleteSectionParams)
    .then((res) => {
      return res.json();
    })
    .then((updatedAssessment) => {
      data.callback(updatedAssessment);
    })
    .catch((error) => {
      console.log('error deleting section');
      console.log(error);
    })
    .done();

  }
}
