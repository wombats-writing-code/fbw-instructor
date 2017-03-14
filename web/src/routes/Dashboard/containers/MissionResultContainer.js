
import { connect } from 'react-redux'

import MissionResult from '../views/MissionResult'
import {parseResults} from '../selectors/resultsSelector'
import {selectDirective} from 'fbw-platform-common/reducers/Mission/selectDirective'
import {selectTarget} from 'fbw-platform-common/reducers/Mission/selectTarget'
import {getStudentResult} from 'fbw-platform-common/reducers/Result/getStudentResult'
import {getMapping, getUser} from 'fbw-platform-common/selectors'
import {getRoster} from 'fbw-platform-common/selectors/course'
import {computeGrades} from '../selectors/resultsSelector'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickDirective: (directiveIndex) => dispatch(selectDirective(directiveIndex)),
    onClickTarget: (target) => dispatch(selectTarget(target)),
    onSelectStudentResult: (student, mission, user) => {
      // console.log('onSelectStudentResult', student, mission, user)
      dispatch(getStudentResult(student, mission, user))
    }
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    user: getUser(state),
    grades: computeGrades(ownProps.mission, ownProps.records, getRoster(state)),
    currentDirectiveIndex: state.mission.currentDirectiveIndex,
    currentTarget: state.mission.currentTarget,
    currentMission: state.mission.currentMission,
    outcomes: getMapping(state).outcomes,
    view: state.view,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionResult)
