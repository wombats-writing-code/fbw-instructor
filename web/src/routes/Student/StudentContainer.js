import { connect } from 'react-redux'
import Student from './Student'

// import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
// import {getPhaseIIResults} from '../../reducers/Mission/getPhaseIIResults'
// import {getPhaseIResults} from '../../reducers/Mission/getPhaseIResults'
// import {createTestFlightMissions} from '../../reducers/Mission/createTestFlightMissions'
// import {recommendMissionSelector} from './selectors/recommendMissionSelector'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    // onSpawnPhaseIIMissions: (data, bankId, mission, date) => dispatch(createTestFlightMissions(data, bankId, mission, date))    // TODO: Cole help? not sure what data args it's expecting
    // getPhaseIIResults: (mission, bankId) => dispatch(getPhaseIIResults(mission, bankId)),
    // getPhaseIResults: (mission) => dispatch(getPhaseIResults(mission)),
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('state in StudentContainer', state);

  return {
    student: state.result.currentStudent,
    mission: state.mission.currentMission && state.mission.currentMission.questions ? state.mission.currentMission : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Student)
