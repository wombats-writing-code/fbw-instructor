import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
import {getResults} from 'fbw-platform-common/reducers/Result/getResults'

import {getRoster} from 'fbw-platform-common/selectors/course'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    view: state.view,
    roster: getRoster(state),
    mission: currentMission,
    missions: state.mission.missions,
    resultsByMission: state.result.resultsByMission,
    isGetResultsInProgress: state.result && state.result.isGetResultsInProgress,
  }
}

export const getDashboardViewNameFromViewName = (viewName) => {
  return viewName && viewName.split('.').length > 0 ? viewName.split('.')[1] : null
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
