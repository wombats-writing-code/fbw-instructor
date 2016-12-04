
import thunk from 'redux-thunk';
import 'lodash'

require('es6-promise').polyfill();
require('isomorphic-fetch');

import {getDomain, momentToQBank} from '../common'

export const UPDATE_MISSION = 'UPDATE_MISSION'
export const RECEIVE_UPDATE_MISSION = 'RECEIVE_UPDATE_MISSION'

export function receiveUpdateMission(mission) {
  return {type: RECEIVE_UPDATE_MISSION, mission };
}


export function updateMissionOptimistic(mission) {
   return {type: UPDATE_MISSION, mission };
}

export function updateMission(data, bankId) {
  let missionParams = {
      assessmentOfferedId: data.assessmentOfferedId,
      displayName: data.displayName,
      genusTypeId: data.genusTypeId,
      startTime: momentToQBank(data.startTime),
      deadline: momentToQBank(data.deadline)
    },
  fetchParams = {
    body: JSON.stringify(missionParams),
    headers: {
      'content-type': 'application/json'
    },
    method: 'PUT'
  };

  return function(dispatch) {
    dispatch(updateMissionOptimistic(missionParams));

    let url = getDomain(location.host) + `/middleman/banks/${bankId}/missions/${data.id}`;

    return fetch(url, fetchParams)
    .then((res) => res.json())
    .then((mission) => {
      console.log('updated mission', mission);

      dispatch(receiveUpdateMission(mission));
    })
    .catch((error) => {
      console.log('error updating mission', error);
    });

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
