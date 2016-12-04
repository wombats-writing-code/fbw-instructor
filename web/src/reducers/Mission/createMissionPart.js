
import 'lodash'

var Q = require('q');

// ------------------------------------
// Actions
// ------------------------------------

// optimistic action creator - this won't be called directly
// by the React components, but from our async thunk function
export function createAssessmentPartOptimistic(data) {
  return {type: CREATE_ASSESSMENT_PART, data };
}

// this is the actual async createAssessment function that calls qbank
export function createAssessmentPart(data, bankId) {

  return function(dispatch) {
    dispatch(createAssessmentPartOptimistic(data));

    var createSectionParams = {
      data: {
        sections: {
          newSections: [{
            scaffold: true,
            quota: 1
          }]
        }
      },
      method: 'PUT',
      path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
    };

  return qbankFetch(createSectionParams)
    .then((res) => res.json())
    .then((updatedAssessment) => {
      // have to return the ID / section of the newly created section here ...
      // it should be the last section (appended)
      data.callback(_.last(updatedAssessment.sections));
    })
    .catch((error) => {
      console.log('error creating a new section');
    })
    .done();
  }

}
