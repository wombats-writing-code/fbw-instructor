
import 'lodash'
import Q from 'q'

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
export function getMapping(bankId, departmentNames) {

  return function(dispatch) {
    let getContentLibraryIds = _.map(departmentNames, (name) => fetch(getDomain(location.host) + `/middleman/departments/${name}/library`));

    return Q.all(getContentLibraryIds)
    .then( (res) => Q.all(_.map(res, (r) => r.text())) )
    .then( (res) => {
      // console.log('get contentlib', res);

      let outcomesUrl = getDomain(location.host) + `/middleman/objectivebanks/${res[0]}/outcomes`;
      let relationshipsUrl = getDomain(location.host) + `/middleman/objectivebanks/${res[0]}/relationships`;

      return Q.all([fetch(outcomesUrl), fetch(relationshipsUrl)])
    })
    .then((res) => Q.all([res[0].json(), res[1].json()]))
    .then((res) => {
      // console.log('received getting mapping', res);

      dispatch(receiveMapping({outcomes: res[0], relationships: res[1]}));
    })
    .catch((error) => {
      console.log('error getting mapping', error);
    });
  }
}
