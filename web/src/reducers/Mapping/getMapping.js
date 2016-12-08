
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

// returns all the data from Handcar
export function getMapping(departmentName) {

  return function(dispatch) {
    console.log('department for mapping', departmentName)
    let modulesUrl = `${getDomain()}/middleman/departments/${departmentName}/modules`;
    let outcomesUrl = `${getDomain()}/middleman/departments/${departmentName}/outcomes`;
    let relationshipsUrl = `${getDomain()}/middleman/departments/${departmentName}/relationships`;

    return axios.all([axios.get(modulesUrl), axios.get(outcomesUrl), axios.get(relationshipsUrl)])
    .then(axios.spread((modules, outcomes, relationships) => {
      // console.log('received getting mapping', modules, outcomes, relationships);

      dispatch(receiveMapping({modules: modules.data, outcomes: outcomes.data, relationships: relationships.data}));
    }))
    .catch((error) => {
      console.log('error getting mapping', error);
    });
  }
}
