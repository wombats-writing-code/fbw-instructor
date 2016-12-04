import _ from 'lodash'
import { connect } from 'react-redux'

import { selectDirective } from '../reducers/Mission/selectDirective'

const mapStateToProps = (state, ownProps) => {
  return {
    currentDirectiveIndex: typeof state.mission.currentDirectiveIndex !== 'undefined' ? state.mission.currentDirectiveIndex : null,
    directives: state.mission.currentMissionSections ? state.mission.currentMissionSections : [],
    targets: state.mission.currentMissionSections ? _.flatten(_.map(state.mission.currentMissionSections, 'questions')) : [],
    outcomes: state.outcome.outcomes ? state.outcome.outcomes : []
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSelectDirective: (data) => {
      dispatch(selectDirective(data));
    },
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
