
import thunk from 'redux-thunk';
import 'lodash'

export const UPDATE_SPAWN_DATE = 'UPDATE_SPAWN_DATE'


export function updateSpawnDate(data) {

  return function(dispatch) {
    dispatch({type: UPDATE_SPAWN_DATE, data});
  }
}
