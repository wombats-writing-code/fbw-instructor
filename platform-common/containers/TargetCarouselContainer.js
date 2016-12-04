import _ from 'lodash'
import { connect } from 'react-redux'

import { isTarget } from 'platform-common/selectors'
import { selectTarget } from 'platform-common/reducers/Mission/selectTarget'

const mapStateToProps = (state, ownProps) => {
  let targets
  if (typeof state.mission.currentDirectiveIndex !== 'undefined') {
    let allQuestions = state.mission.currentMissionSections[state.mission.currentDirectiveIndex].questions
    targets = _.filter(allQuestions, isTarget)
  }
  return {
    currentDirectiveIndex: state.mission.currentDirectiveIndex,  // used for tabIndex on web side
    currentTargetIndex: state.mission.currentTargetIndex,
    targets: targets,
    outcomes: state.outcome.outcomes ? state.outcome.outcomes : []
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSelectTarget: data => dispatch(selectTarget(data))
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
