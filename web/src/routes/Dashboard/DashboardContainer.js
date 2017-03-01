import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
import {getResults, getResultsBulk} from 'fbw-platform-common/reducers/Result/getResults'
import {getUser} from 'fbw-platform-common/selectors'
import {getRoster} from 'fbw-platform-common/selectors/course'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    onClickRefreshResults: (mission, user) => {
      // this gets results for the mission that was clicked
      dispatch(getResults({mission, user}));
      // we also want to get the results for all of its phase 2 missions
      dispatch(getResultsBulk({missions: mission.leadsToMissions, user}));
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    user: getUser(state),
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
