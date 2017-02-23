
import { connect } from 'react-redux'

import ResultsView from '../views/ResultsView'
import {parseResults} from '../selectors/resultsSelector'
import {selectDirective} from 'fbw-platform-common/reducers/Mission/selectDirective'
import {selectTarget} from 'fbw-platform-common/reducers/Mission/selectTarget'
import {selectStudentResult} from 'fbw-platform-common/reducers/Mission/selectStudentResult'
import {getMapping} from 'fbw-platform-common/selectors'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickDirective: (directiveIndex) => dispatch(selectDirective(directiveIndex)),
    onClickTarget: (target) => dispatch(selectTarget(target)),
    onSelectStudentResult: (missionResult, currentDirectiveIndex, question) => dispatch(selectStudentResult(missionResult, currentDirectiveIndex, question)),
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    results: parseResults(state),
    currentDirectiveIndex: state.mission.currentDirectiveIndex,
    currentTarget: state.mission.currentTarget,
    currentMission: state.mission.currentMission,
    outcomes: getMapping(state).outcomes,
    view: state.view,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsView)
