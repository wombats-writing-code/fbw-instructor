import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
import {getResultsAll, getResults} from '../../reducers/Mission/getResults'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    getResultsAll: (mission, bankId) => dispatch(getResultsAll(mission, bankId)),
    getResults: (mission) => dispatch(getResults(mission)),
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentMission = state.mission ? state.mission.currentMission : null;

  return {
    view: state.view,
    currentBankId: state.bank.currentBank ? state.bank.currentBank.id : null,
    mission: state.mission ? state.mission.currentMission : null,
    isGetResultsInProgress: state.mission ? state.mission.isGetResultsInProgress : false,
    isGetSpawnResultsInProgress: false,     // TODO
  }
}

export const getDashboardViewNameFromViewName = (viewName) => {
  return viewName && viewName.split('.').length > 0 ? viewName.split('.')[1] : null
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
