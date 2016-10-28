import { connect } from 'react-redux'
import MissionControl from './MissionControl'

import {createMission} from '../../reducers/Mission/createMission'
import {updateMission} from '../../reducers/Mission/updateMission'
import {updateMissionForm} from '../../reducers/Mission/updateMissionForm'
import {updateEditMissionForm} from '../../reducers/Mission/updateEditMissionForm'

import {changeView} from '../../reducers/view'



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddMission: (newMission, bankId) => {
      dispatch(createMission(newMission, bankId));
      dispatch(changeView({name: 'dashboard', mission: newMission}))
    },
    onUpdateMission: (newMission) => { dispatch(updateMission(newMission)) },
    updateMissionForm: (missionFormData) => { dispatch(updateMissionForm(missionFormData)) },
    updateEditMissionForm: (missionFormData) => { dispatch(updateEditMissionForm(missionFormData)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  // haven't decided if this should be passed down as props or from state yet
  return {
    view: state.view,
    mission: state.mission.currentMission,
    newMission: state.mission.newMission,
    currentBank: state.bank.currentBank,
    editMission: state.mission.editMission
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionControl)
