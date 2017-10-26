import { connect } from 'react-redux'
import {browserHistory} from 'react-router'
import MissionEdit from './MissionEdit'

import {createMission, createMissions} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from 'fbw-platform-common/reducers/edit-mission/updateMission'

import {changeMissionName} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionType} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionStart} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionEnd} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionLeadsToEnd} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {selectModule} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeOutcomeSearch} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {toggleOutcome} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {moveOutcomeUp} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {moveOutcomeDown} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeFollowsFromMissions} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {visualizeEntity, closeVisualizeEntity} from 'fbw-platform-common/reducers/Mapping/visualizeEntity'

import {getResults} from 'fbw-platform-common/reducers/Result/getResults'

import {changeView} from '../../reducers/view'
import {getMapping, getUser} from 'fbw-platform-common/selectors/'
import {getCurrentCourse, getRoster} from 'fbw-platform-common/selectors/course'

import {itemsForDirectivesSelector, displayedDirectivesSelector, visualizeEntitiesSelector} from './selectors/'
import {computeRecommendations} from './selectors/recommendMissionSelector'



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCreateMission: (newMission, course, user) => {
      dispatch(createMission(newMission, course, user));
    },
    onCreateMissions: (newMissions, course, user) => {
      dispatch(createMissions(newMissions, course, user));
    },
    onUpdateMission: (mission, user) => {
      dispatch(updateMission(mission, user))
    },
    onChangeMissionName: (value) => dispatch(changeMissionName(value)),
    onChangeMissionType: (missionType) => dispatch(changeMissionType(missionType)),
    onChangeMissionStart: (momentObj) => dispatch(changeMissionStart(momentObj)),
    onChangeMissionEnd: (momentObj) => dispatch(changeMissionEnd(momentObj)),
    onChangeMissionLeadsToEnd: (momentObj) => {
      // console.log('calling reducer to change leadsToMissionsDeadline')
      dispatch(changeMissionLeadsToEnd(momentObj))
    },
    onSelectModule: (module) => dispatch(selectModule(module)),
    onChangeOutcomeSearch: (query) => dispatch(changeOutcomeSearch(query)),
    onToggleOutcome: (outcome) => dispatch(toggleOutcome(outcome)),
    onMoveOutcomeUp: (outcome) => dispatch(moveOutcomeUp(outcome)),
    onMoveOutcomeDown: (outcome) => dispatch(moveOutcomeDown(outcome)),
    onVisualizeEntity: (entity) => dispatch(visualizeEntity(entity)),
    onCloseVisualizeEntity: () => dispatch(closeVisualizeEntity()),
    onSelectFollowFromMissions: (missions, user) => {
      _.each(missions, m => dispatch(getResults({mission: m, user})));
      dispatch(changeFollowsFromMissions(missions))
    },
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('state in editmissionContainer', state);

  return {
    currentCourse: getCurrentCourse(state),
    user: getUser(state),
    editView: state.location.query.view,
    missions: state.mission.missions,
    mapping: getMapping(state),
    newMission: state.editMission.newMission,
    currentMission: state.mission.currentMission,
    selectedModule: state.editMission.selectedModule,
    currentEntity: state.mapping.currentEntity,
    visualizedEntities: visualizeEntitiesSelector(state),
    outcomeQuery: state.editMission.outcomeQuery,
    recommendations: computeRecommendations(state),
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
    displayedDirectives: displayedDirectivesSelector(state, ownProps),
    itemsForDirectives: itemsForDirectivesSelector(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionEdit)
