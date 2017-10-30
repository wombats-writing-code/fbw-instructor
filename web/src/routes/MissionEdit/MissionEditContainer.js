import { connect } from 'react-redux'
import {browserHistory} from 'react-router'
import MissionEdit from './MissionEdit'

import {createMission, createMissions} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMission'

import {changeMissionName} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionType} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionStart} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionEnd} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {selectModule} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeOutcomeSearch} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {toggleOutcome} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {moveOutcomeUp} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {moveOutcomeDown} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeFollowsFromMissions} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {visualizeEntity, closeVisualizeEntity} from '@wombats-writing-code/fbw-platform-common/reducers/Mapping/visualizeEntity'

import {getResults} from '@wombats-writing-code/fbw-platform-common/reducers/Result/getResults'

import {changeView} from '../../reducers/view'
import {getMapping, getUser} from '@wombats-writing-code/fbw-platform-common/selectors/'
import {getCurrentCourse, getRoster} from '@wombats-writing-code/fbw-platform-common/selectors/course'

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
