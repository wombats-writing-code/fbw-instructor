import { connect } from 'react-redux'

import {selectDirective} from 'fbw-platform-common/reducers/Mission/selectDirective'
import {selectTarget} from 'fbw-platform-common/reducers/Mission/selectTarget'
import {getStudentResult} from 'fbw-platform-common/reducers/Result/getStudentResult'
import {createMissions} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {updateMission} from 'fbw-platform-common/reducers/edit-mission/updateMission'
import {deleteMission} from 'fbw-platform-common/reducers/edit-mission/deleteMission'
import {changeMissionStart, changeMissionEnd} from 'fbw-platform-common/reducers/edit-mission/updateMissionForm'
import {clickEditMission, cancelEditMission} from 'fbw-platform-common/reducers/edit-mission/clickEditMission'
import {getMapping, getUser} from 'fbw-platform-common/selectors'
import {getCurrentCourse, getRoster} from 'fbw-platform-common/selectors/course'

import MissionResult from './MissionResult'
import {parseResults, computeGrades} from '../../selectors/resultsSelector'



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickDirective: (directiveIndex) => dispatch(selectDirective(directiveIndex)),
    onClickTarget: (target) => dispatch(selectTarget(target)),
    onSelectStudentResult: (student, mission, user) => {
      console.log('onSelectStudentResult student:', student)
      console.log('onSelectStudentResult mission', mission)
      dispatch(getStudentResult(student, mission, user))
    },
    onCreateMissions: (newMissions, course, user) => {
      dispatch(createMissions(newMissions, course, user));
    },
    // onClickEditMission: mission => dispatch(editMission(mission, getMapping(state).outcomes)),
    onClickEditMission: mission => dispatch(clickEditMission(mission)),
    onChangeMissionStart: (momentObj) => dispatch(changeMissionStart(momentObj)),
    onChangeMissionEnd: (momentObj) => dispatch(changeMissionEnd(momentObj)),
    onClickCancelEditMission: () => dispatch(cancelEditMission()),
    onClickDeleteEditMission: (mission, user) => dispatch(deleteMission(mission, user)),
    onClickSaveEditMission: (mission, user) => dispatch(updateMission(mission, user)),
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    user: getUser(state),
    grades: computeGrades(ownProps.mission, ownProps.records, getRoster(state)),
    currentDirectiveIndex: state.mission.currentDirectiveIndex,
    currentTarget: state.mission.currentTarget,
    currentMission: state.mission.currentMission,
    currentCourse: getCurrentCourse(state),
    missions: state.mission.missions,
    outcomes: getMapping(state).outcomes,
    roster: getRoster(state),
    view: state.view,
    currentEditMission: state.editMission.newMission,
    isGetResultsInProgress: state.result && state.result.isGetResultsInProgress,
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
    isEditMissionInProgress: state.editMission.isEditMissionInProgress,
    isUpdateMissionInProgress: state.editMission.isUpdateMissionInProgress,
    isDeleteMissionInProgress: state.editMission.isDeleteMissionInProgress
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionResult)
