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
  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    // view: state.view,
    // currentBankId: state.bank.currentBank ? state.bank.currentBank.id : null,
    // mission: state.mission ? state.mission.currentMission : null,
    // isGetPhaseIResultsInProgress: state.mission ? state.mission.isGetPhaseIResultsInProgress : false,
    // isGetPhaseIIResultsInProgress: state.mission ? state.mission.isGetPhaseIIResultsInProgress : false,
    // isGetSpawnResultsInProgress: false,     // TODO
    // isSpawnInProgress: state.mission && state.mission.isSpawnInProgress,
    // recommendation: recommendMissionSelector(state, ownProps)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Student)
