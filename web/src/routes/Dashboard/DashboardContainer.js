import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
import {getPhaseIIResults} from 'fbw-platform-common/reducers/Result/getPhaseIIResults'
import {getPhaseIResults} from 'fbw-platform-common/reducers/Result/getPhaseIResults'
import {createTestFlightMissions} from 'fbw-platform-common/reducers/edit-mission/createTestFlightMissions'
import {recommendMissionSelector} from './selectors/recommendMissionSelector'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    onSpawnPhaseIIMissions: (data, bankId, mission, date) => dispatch(createTestFlightMissions(data, bankId, mission, date))    // TODO: Cole help? not sure what data args it's expecting

    // getPhaseIIResults: (mission, bankId) => dispatch(getPhaseIIResults(mission, bankId)),
    // getPhaseIResults: (mission) => dispatch(getPhaseIResults(mission)),
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    view: state.view,
    currentBankId: state.bank.currentBank ? state.bank.currentBank.id : null,
    mission: state.mission ? state.mission.currentMission : null,
    isGetPhaseIResultsInProgress: state.result ? state.result.isGetPhaseIResultsInProgress : false,
    isGetPhaseIIResultsInProgress: state.result ? state.result.isGetPhaseIIResultsInProgress : false,
    isGetSpawnResultsInProgress: false,     // TODO
    isSpawnInProgress: state.editMission && state.editMission.isSpawnInProgress,
    recommendation: recommendMissionSelector(state, ownProps)
  }
}

export const getDashboardViewNameFromViewName = (viewName) => {
  return viewName && viewName.split('.').length > 0 ? viewName.split('.')[1] : null
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
