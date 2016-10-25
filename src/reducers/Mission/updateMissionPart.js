import thunk from 'redux-thunk';
import 'lodash'

var Q = require('q');

export function updateMissionPartOptimistic(data) {
  return {type: UPDATE_MISSION_PART, data };
}

export function updateMissionPart(data, bankId) {

  return function(dispatch) {
    dispatch(updateMissionPartOptimistic(data));

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
    .then((updatedMission) => {
      // return the newly updated section
      let updatedSection = _.find(updatedMission.sections, {id: data.params.id});
      //_this.getMissions();
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
