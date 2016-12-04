
import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');

export function updateAssessmentOfferedOptimistic(data) {
  return {type: UPDATE_ASSESSMENT_OFFERED, data };
}

export function updateAssessmentOffered(data, bankId) {

  return function(dispatch) {
    dispatch(updateAssessmentOfferedOptimistic(data));

    var updateOfferedParams = {
      data: {
      },
      method: 'PUT',
      path: `assessment/banks/${bankId}/assessmentsoffered/${data.assessmentOfferedId}`
    };
    _.assign(updateOfferedParams.data, data.params);
    console.log(updateOfferedParams);

    return qbankFetch(updateOfferedParams)
    .then((res) => res.json())
    .then((updatedAssessmentOffered) => {
      // update the mission deadline and startTime
      // in stores, then emit a change
      let updatedMissions = [];
      console.log(updatedAssessmentOffered);
      _.each(_assessments, (assessment) => {
        if (assessment.id == updatedAssessmentOffered.assessmentId) {
          // update it before appending
          assessment.startTime = updatedAssessmentOffered.startTime;
          assessment.deadline = updatedAssessmentOffered.deadline;
          updatedMissions.push(assessment);
        } else {
          updatedMissions.push(assessment);
        }
      })

      _assessments = updatedMissions;
      _this.emitChange();
    })
    .catch((error) => {
      console.log('error updating assessment offered');
      console.log(error);
    })
    .done();
  }
}
