import { connect } from 'react-redux'
import MissionForm from './MissionForm'

import {createMission} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from 'fbw-platform-common/reducers/edit-mission/updateMission'
import {updateMissionForm} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
// import {updateEditMissionForm} from 'fbw-platform-common/reducers/edit-mission/updateEditMissionForm'

import {changeView} from '../../reducers/view'
import {getCurrentCourse} from 'fbw-platform-common/selectors/course'

import {moduleTreeSelector, itemsForDirectivesSelector, displayedDirectivesSelector} from './selectors/'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddMission: (newMission, courseId, directivesItemsMap, itemCourseId) => {
      dispatch(createMission(newMission, courseId, directivesItemsMap, itemCourseId));

      // TODO
      dispatch(changeView({name: 'dashboard.resultsView', mission: newMission}))
    },
    // onSelectModule: (module) => dispatch(selectModule(module)),
    onUpdateMission: (newMission, courseId, directiveItemsMap, itemCourseId) => {
      dispatch(updateMission(newMission, courseId, directiveItemsMap));
    },
    updateMissionForm: (missionFormData) => { dispatch(updateMissionForm(missionFormData)) },
    //updateEditMissionForm: (missionFormData) => { dispatch(updateEditMissionForm(missionFormData)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('state in MissionFormContainer', state);

  // haven't decided if this should be passed down as props or from state yet
  return {
    view: state.view,
    newMission: state.editMission.newMission,
    editMission: state.editMission.editMission,
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
    currentCourse: getCurrentCourse(state),
    moduleTree: moduleTreeSelector(state),
    displayedDirectives: displayedDirectivesSelector(state, ownProps),
    numberItemsForDirectives: itemsForDirectivesSelector(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionForm)
