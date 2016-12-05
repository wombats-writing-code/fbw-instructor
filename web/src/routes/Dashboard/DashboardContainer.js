import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
import {getPhaseIIResults} from '../../reducers/Mission/getPhaseIIResults'
import {getPhaseIResults} from '../../reducers/Mission/getPhaseIResults'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    getPhaseIIResults: (mission, bankId) => dispatch(getPhaseIIResults(mission, bankId)),
    getPhaseIResults: (mission) => dispatch(getPhaseIResults(mission)),
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentMission = state.mission ? state.mission.currentMission : null;

  return {
    view: state.view,
    currentBankId: state.bank.currentBank ? state.bank.currentBank.id : null,
    mission: state.mission ? state.mission.currentMission : null,
    isGetPhaseIResultsInProgress: state.mission ? state.mission.isGetPhaseIResultsInProgress : false,
    isGetPhaseIIResultsInProgress: state.mission ? state.mission.isGetPhaseIIResultsInProgress : false,
    isGetSpawnResultsInProgress: false,     // TODO
  }
}

export const getDashboardViewNameFromViewName = (viewName) => {
  return viewName && viewName.split('.').length > 0 ? viewName.split('.')[1] : null
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
