import { connect } from 'react-redux'
import MissionForm from './MissionForm'

import {createMission, createMissions} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from 'fbw-platform-common/reducers/edit-mission/updateMission'

import {changeMissionName} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionType} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionStart} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeMissionEnd} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {selectModule} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeOutcomeSearch} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {toggleOutcome} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {changeFollowsFromMissions} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {getResults} from 'fbw-platform-common/reducers/Result/getResults'

import {changeView} from '../../reducers/view'
import {getMapping, getUser} from 'fbw-platform-common/selectors/'
import {getCurrentCourse, getRoster} from 'fbw-platform-common/selectors/course'

import {itemsForDirectivesSelector, displayedDirectivesSelector} from './selectors/'
import {computeRecommendations} from './selectors/recommendMissionSelector'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCreateMission: (newMission, course, user) => dispatch(createMission(newMission, course, user)),
    onCreateMissions: (newMissions, course, user) => {
      dispatch(createMissions(newMissions, course, user));
      dispatch(changeView({name: 'dashboard.resultsView', mission: ownProps.currentMission}));
    },
    onUpdateMission: (mission, user) => dispatch(updateMission(mission, user)),
    onChangeMissionName: (value) => dispatch(changeMissionName(value)),
    onChangeMissionType: (missionType) => dispatch(changeMissionType(missionType)),
    onChangeMissionStart: (momentObj) => dispatch(changeMissionStart(momentObj)),
    onChangeMissionEnd: (momentObj) => dispatch(changeMissionEnd(momentObj)),
    onSelectModule: (module) => dispatch(selectModule(module)),
    onChangeOutcomeSearch: (query) => dispatch(changeOutcomeSearch(query)),
    onToggleOutcome: (outcome) => dispatch(toggleOutcome(outcome)),
    onSelectFollowFromMissions: (missions, user) => {
      _.each(missions, m => dispatch(getResults({mission: m, user})));
      dispatch(changeFollowsFromMissions(missions))
    },
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('state in MissionFormContainer', state);

  return {
    currentCourse: getCurrentCourse(state),
    user: getUser(state),
    view: state.view,
    missions: state.mission.missions,
    mapping: getMapping(state),
    newMission: state.editMission.newMission,
    selectedModule: state.editMission.selectedModule,
    outcomeQuery: state.editMission.outcomeQuery,
    recommendations: computeRecommendations(state),
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
    displayedDirectives: displayedDirectivesSelector(state, ownProps),
    itemsForDirectives: itemsForDirectivesSelector(state),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionForm)
