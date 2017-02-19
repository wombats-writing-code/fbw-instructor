
import { connect } from 'react-redux'

import ResultsView from '../views/ResultsView'
import {makeResultsSelector} from '../selectors/resultsSelector'
import {selectDirective} from 'fbw-platform-common/reducers/Mission/selectDirective'
import {selectTarget} from 'fbw-platform-common/reducers/Mission/selectTarget'
import {selectStudentResult} from 'fbw-platform-common/reducers/Mission/selectStudentResult'
import {getMapping} from 'fbw-platform-common/selectors'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickDirective: (directiveIndex) => dispatch(selectDirective(directiveIndex)),
    onClickTarget: (target) => dispatch(selectTarget(target)),
    onSelectMissionResult: (missionResult, currentDirectiveIndex, question) => dispatch(selectStudentResult(missionResult, currentDirectiveIndex, question)),
  }
}

// https://github.com/reactjs/reselect#accessing-react-props-in-selectors
const makeMapStateToProps = (state, ownProps) => {
  const getResultsSelector = makeResultsSelector();

  const mapStateToProps = (state, ownProps) => {
    // console.log('results view state change', ownProps)
    // console.log('results view state', state)
    // console.log('props', ownProps)
    // console.log('results')
    return {
      currentDirectiveIndex: state.mission.currentDirectiveIndex,
      currentTarget: state.mission.currentTarget,
      currentMission: state.mission.currentMission,
      outcomes: getMapping(state).outcomes,
      view: state.view,
      viewData: getResultsSelector(state, ownProps)
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ResultsView)
