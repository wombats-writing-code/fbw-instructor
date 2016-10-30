import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView} from '../../reducers/view'
import {changeMouseOver, changeClick} from '../../reducers/analysis'
import {outcomesViewSelector} from './selectors'



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    onNodeMouseover: (node, viewName) => dispatch(changeMouseOver(node, viewName)),
    onNodeClick: (node, viewName) => dispatch(changeClick(node, viewName))
    // onEdgeMouseover: (node) => dispatch()
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    view: state.view,
    viewState: state.analysis.outcomesView,
    mission: state.mission ? state.mission.currentMission : null,
    results: state.mission ? state.mission.results : [],
    outcomesViewData: outcomesViewSelector(state.mission ? state.mission.results : null, state.mapping),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
