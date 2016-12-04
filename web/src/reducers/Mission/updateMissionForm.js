
import thunk from 'redux-thunk';
import 'lodash'

export const UPDATE_MISSION_FORM = 'UPDATE_MISSION_FORM'


export function updateMissionForm(data) {

  return function(dispatch) {
    dispatch({type: UPDATE_MISSION_FORM, data});
  }
}
