import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick, selectDirective} from '../../reducers/view'
import {createTestFlightMissions} from '../../reducers/Mission/createTestFlightMissions'

// import {outcomesViewSelector} from './selectors/outcomesViewSelector'
import {questionsViewSelector} from './selectors/questionsViewSelector'
import {spawnViewSelector} from './selectors/spawnViewSelector'


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    onClickDirective: (directive, viewName) => dispatch(selectDirective(directive, viewName)),
    createTestFlightMissions: (studentData, bankId) => dispatch(createTestFlightMissions(studentData, bankId))
    // onNodeMouseover: (node, viewName) => dispatch(changeMouseOver(node, viewName)),
    // onNodeClick: (node, viewName) => dispatch(changeClick(node, viewName)),
    // onEdgeMouseover: (node) => dispatch()
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    view: state.view,
    // viewState: state.analysis[state.view.name],
    // outcomesViewData: outcomesViewSelector(state),        // might restructure this state shape with viewState
    viewData: state.view.name === 'dashboard.confirmView' ? spawnViewSelector(state) : questionsViewSelector(state),
    mission: state.mission ? state.mission.currentMission : null,
    results: state.mission ? state.mission.results : [],
    isGetResultsInProgress: state.mission ? state.mission.isGetResultsInProgress : false,
    currentBankId: state.bank.currentBank ? state.bank.currentBank.id : null,
    spawnComplete: state.mission.spawnComplete ? state.mission.spawnComplete : false
  }
}

export const getDashboardViewNameFromViewName = (viewName) => {
  return viewName && viewName.split('.').length > 0 ? viewName.split('.')[1] : null
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
