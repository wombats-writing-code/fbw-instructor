

import { connect } from 'react-redux'

import RecommendMission from '../views/RecommendMission'

import {recommendMissionSelector} from '../selectors/recommendMissionSelector'
import {createTestFlightMissions} from 'fbw-platform-common/reducers/edit-mission/createTestFlightMissions'
import {updateSpawnDate} from 'fbw-platform-common/reducers/edit-mission/updateSpawnDate'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSpawnDate: (date) => dispatch(updateSpawnDate(date)),
    createTestFlightMissions: (studentData, bankId, currentMission, spawnDate) => dispatch(createTestFlightMissions(studentData, bankId, currentMission, spawnDate)),
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    view: state.view,
    mission: state.mission ? state.mission.currentMission : null,
    recommendation: recommendMissionSelector(state),
    isSpawnInProgress: state.mission.isSpawnInProgress ? state.mission.isSpawnInProgress : false,
    spawnDate: state.mission.spawnDate ? state.mission.spawnDate : null,
    spawnDateFocused: state.mission.spawnDateFocused ? state.mission.spawnDateFocused : false,
    spawnedMissions: state.mission.spawnedMissionsByMission && currentMission ? state.mission.spawnedMissionsByMission[currentMission.id] : null
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RecommendMission)
