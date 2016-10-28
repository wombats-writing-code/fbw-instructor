import { connect } from 'react-redux'
import MissionControl from './MissionControl'

import {createMission} from '../../reducers/Mission/createMission'
import {updateMission} from '../../reducers/Mission/updateMission'
import {updateMissionForm} from '../../reducers/Mission/updateMissionForm'



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddMission: (newMission) => { dispatch(createMission(newMission)) },
    onUpdateMission: (newMission) => { dispatch(updateMission(newMission)) },
    updateMissionForm: (missionFormData) => { dispatch(updateMissionForm(missionFormData)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  // haven't decided if this should be passed down as props or from state yet
  return {
    view: state.view,
    mission: state.mission.currentMission,
    startTime: state.mission.newMission.startTime,
    deadline: state.mission.newMission.deadline,
    displayName: state.mission.newMission.displayName,
    genusTypeId: state.mission.newMission.genusTypeId,
    focusedInput: state.mission.newMission.focusedInput
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionControl)
