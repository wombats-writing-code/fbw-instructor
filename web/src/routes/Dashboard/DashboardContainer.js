import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
import {getPhaseIIResults} from 'fbw-platform-common/reducers/Result/getPhaseIIResults'
import {getPhaseIResults} from 'fbw-platform-common/reducers/Result/getPhaseIResults'
import {recommendMissionSelector} from './selectors/recommendMissionSelector'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),

    // getPhaseIIResults: (mission, bankId) => dispatch(getPhaseIIResults(mission, bankId)),
    // getPhaseIResults: (mission) => dispatch(getPhaseIResults(mission)),
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    view: state.view,
    mission: state.mission ? state.mission.currentMission : null,
    isGetPhaseIResultsInProgress: state.result && state.result.isGetPhaseIResultsInProgress,
    isGetPhaseIIResultsInProgress: state.result && state.result.isGetPhaseIIResultsInProgress,
    isGetSpawnResultsInProgress: false,     // TODO
    isSpawnInProgress: state.editMission && state.editMission.isSpawnInProgress,
  }
}

export const getDashboardViewNameFromViewName = (viewName) => {
  return viewName && viewName.split('.').length > 0 ? viewName.split('.')[1] : null
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
