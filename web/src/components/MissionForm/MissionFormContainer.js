import { connect } from 'react-redux'
import MissionForm from './MissionForm'

import {createMission} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from 'fbw-platform-common/reducers/edit-mission/updateMission'
import {updateMissionForm} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
// import {updateEditMissionForm} from 'fbw-platform-common/reducers/edit-mission/updateEditMissionForm'

import {changeView} from '../../reducers/view'
import {getMapping} from 'fbw-platform-common/selectors/'
import {getCurrentCourse} from 'fbw-platform-common/selectors/course'

import {itemsForDirectivesSelector, displayedDirectivesSelector} from './selectors/'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCreateMission: (newMission, course) => {
      dispatch(createMission(newMission, course));
      // dispatch(changeView({name: 'dashboard.resultsView', mission: newMission}))
    },
    // onSelectModule: (module) => dispatch(selectModule(module)),
    onUpdateMission: (newMission, course, directiveItemsMap) => {
      dispatch(updateMission(newMission, course, directiveItemsMap));
    },
    updateMissionForm: (missionFormData) => { dispatch(updateMissionForm(missionFormData)) },
    //updateEditMissionForm: (missionFormData) => { dispatch(updateEditMissionForm(missionFormData)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('state in MissionFormContainer', state);

  return {
    view: state.view,
    newMission: state.editMission.newMission,
    editMission: state.editMission.editMission,
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
    currentCourse: getCurrentCourse(state),
    mapping: getMapping(state),
    displayedDirectives: displayedDirectivesSelector(state, ownProps),
    numberItemsForDirectives: itemsForDirectivesSelector(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionForm)
