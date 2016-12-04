
import thunk from 'redux-thunk';
import 'lodash'

export const UPDATE_EDIT_MISSION_FORM = 'UPDATE_EDIT_MISSION_FORM'


export function updateEditMissionForm(data) {

  return function(dispatch) {
    dispatch({type: UPDATE_EDIT_MISSION_FORM, data});
  }
}
