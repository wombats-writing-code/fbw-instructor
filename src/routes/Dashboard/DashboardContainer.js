import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView} from '../../reducers/view'

import {outcomesViewSelector} from './selectors'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    view: state.view,
    mission: state.mission ? state.mission.currentMission : null,
    results: state.mission ? state.mission.results : [],
    outcomesViewData: outcomesViewSelector(state.mission ? state.mission.results : null, state.mapping)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
