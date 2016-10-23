import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');

let credentials = require('../../credentials/credentials');
var qbankFetch = require('fbw-utils')(credentials).qbankFetch;


export function updateAssessmentPartOptimistic(data) {
  return {type: UPDATE_ASSESSMENT_PART, data };
}

export function updateAssessmentPart(data, bankId) {

  return function(dispatch) {
    dispatch(updateAssessmentPartOptimistic(data));

    var updateSectionParams = {
      data: {
        sections: {
          updatedSections: [{
            scaffold: true,
            quota: 1
          }]
        }
      },
      method: 'PUT',
      path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
    };
    _.assign(updateSectionParams.data.sections.updatedSections[0], data.params);

    return qbankFetch(updateSectionParams)
    .then((res) => {
      return res.json();
    })
    .then((updatedAssessment) => {
      // return the newly updated section
      let updatedSection = _.find(updatedAssessment.sections, {id: data.params.id});
      //_this.getAssessments();
      // when updating a section with items, need to return the itemIds
      // back, so the UI can be updated appropriately
      if (data.params.itemIds) {
        data.callback(updatedSection, data.params.itemIds);
      } else {
        data.callback(updatedSection);
      }
    })
    .catch((error) => {
      console.log('error updating section');
    })
    .done();
  }
}
