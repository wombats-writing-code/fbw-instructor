import { connect } from 'react-redux'

import RecommendMission from '../views/RecommendMission'

import {recommendMissionSelector} from '../selectors/recommendMissionSelector'
import {createTestFlightMissions} from 'fbw-platform-common/reducers/edit-mission/createTestFlightMissions'
import {updateSpawnDate} from 'fbw-platform-common/reducers/edit-mission/updateSpawnDate'
import {getCurrentCourse} from 'fbw-platform-common/selectors/course'
import { isTarget } from 'fbw-platform-common/selectors/mission'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSpawnDateChange: (dateData) => {
      console.log('called updateSpawnDate', dateData)
      dispatch(updateSpawnDate(dateData));
    },
    onSpawnPhaseIIMissions: (studentData, courseId, currentMission, spawnDate) => dispatch(createTestFlightMissions(studentData, courseId, currentMission, spawnDate)),
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('state in recommend missions container', state);
  let currentMission = state.mission.currentMission;

  return {
    currentCourse: getCurrentCourse(state),
    view: state.view,
    mission: currentMission,
    recommendation: recommendMissionSelector(state),
    isSpawnInProgress: state.editMission.isSpawnInProgress ? state.editMission.isSpawnInProgress : false,
    spawnDate: state.editMission.spawnDate,
    spawnDateFocused: state.editMission.spawnDateFocused,
    spawnedMissions: state.editMission.spawnedMissionsByMission && currentMission ? state.editMission.spawnedMissionsByMission[currentMission.id] : null
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RecommendMission)
