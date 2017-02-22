import { connect } from 'react-redux'
import MissionForm from './MissionForm'

import {createMission} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from 'fbw-platform-common/reducers/edit-mission/updateMission'
// import {updateMissionForm} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionName} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionType} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionStart} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionEnd} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {selectModule} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeOutcomeSearch} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {toggleOutcome} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeFollowsFromMissions} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'

import {changeView} from '../../reducers/view'
import {getMapping} from 'fbw-platform-common/selectors/'
import {getCurrentCourse, getRoster} from 'fbw-platform-common/selectors/course'
// import {getMissionForm} from 'fbw-platform-common/selectors/course'

import {itemsForDirectivesSelector, displayedDirectivesSelector} from './selectors/'
import {computeRecommendations} from './selectors/recommendMissionSelector'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCreateMission: (newMission, course, user) => dispatch(createMission(newMission, course, user)),
    
    onChangeMissionName: (value) => dispatch(changeMissionName(value)),
    onChangeMissionType: (missionType) => dispatch(changeMissionType(missionType)),
    onChangeMissionStart: (momentObj) => dispatch(changeMissionStart(momentObj)),
    onChangeMissionEnd: (momentObj) => dispatch(changeMissionEnd(momentObj)),
    onSelectModule: (module) => dispatch(selectModule(module)),
    onChangeOutcomeSearch: (query) => dispatch(changeOutcomeSearch(query)),
    onToggleOutcome: (outcome) => dispatch(toggleOutcome(outcome)),
    onSelectFollowFromMissions: (missions) => dispatch(changeFollowsFromMissions(missions)),
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('state in MissionFormContainer', state);

  return {
    view: state.view,
    missions: state.mission.missions,
    mapping: getMapping(state),
    newMission: state.editMission.newMission,
    selectedModule: state.editMission.selectedModule,
    outcomeQuery: state.editMission.outcomeQuery,
    recommendations: computeRecommendations(
      _.map(state.editMission.newMission.followsFromMissions, missionId => _.find(state.mission.missions, {id:missionId})),
      _.map(state.editMission.newMission.followsFromMissions, missionId => state.result.resultsByMission[missionId]),
      getRoster(state),
    ),

    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
    currentCourse: getCurrentCourse(state),
    displayedDirectives: displayedDirectivesSelector(state, ownProps),
    numberItemsForDirectives: itemsForDirectivesSelector(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionForm)
