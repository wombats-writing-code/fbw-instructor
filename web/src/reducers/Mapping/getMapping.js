
import 'lodash'
import axios from 'axios'

import {getDomain} from '../common'

// ----
// Action types
export const RECEIVE_MAPPING = 'RECEIVE_MAPPING'
// ----

// ------------------------------------
// Actions
// ------------------------------------

export function receiveMapping(mapping) {
  return {type: RECEIVE_MAPPING, mapping};
}

// returns a list of Mission offereds
export function getMapping(departmentName) {

  return function(dispatch) {
    let modulesUrl = `${getDomain()}/middleman/objectivebanks/${departmentName}/modules`;
    let outcomesUrl = `${getDomain()}/middleman/objectivebanks/${departmentName}/outcomes`;
    let relationshipsUrl = `${getDomain()}/middleman/objectivebanks/${departmentName}/relationships`;

    return axios.all([axios.get(modulesUrl), axios.get(outcomesUrl), axios.get(relationshipsUrl)])
    .then(axios.spread((modules, outcomes, relationships) => {
      // console.log('received getting mapping', res);

      dispatch(receiveMapping({modules: modules, outcomes: outcomes, relationships: relationships}));
    }))
    .catch((error) => {
      console.log('error getting mapping', error);
    });
  }
}
