import { connect } from 'react-redux'
import MissionControl from './MissionControl'

import {createMission} from '../../reducers/Mission/createMission'
import {updateMission} from '../../reducers/Mission/updateMission'



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddMission: (newMission) => { dispatch(createMission(newMission)) },
    onUpdateMission: (newMission) => { dispatch(updateMission(newMission)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  // haven't decided if this should be passed down as props or from state yet
  return {
    view: state.view,
    mission: state.mission.currentMission
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionControl)
