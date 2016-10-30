import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView} from '../../reducers/view'
import {changeMouseOver, changeClick} from '../../reducers/analysis'

import {outcomesViewSelector} from './selectors/outcomesViewSelector'
import {questionsViewSelector} from './selectors/questionsViewSelector'



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
    viewState: state.analysis[getDashboardViewNameFromViewName(state.view.name)],
    mission: state.mission ? state.mission.currentMission : null,
    results: state.mission ? state.mission.results : [],
    isGetResultsInProgress: state.mission ? state.mission.isGetResultsInProgress : false,
    outcomesViewData: outcomesViewSelector(state),
    questionsViewData: questionsViewSelector(state),
  }
}

export const getDashboardViewNameFromViewName = (viewName) => {
  return viewName && viewName.split('.').length > 0 ? viewName.split('.')[1] : null
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
