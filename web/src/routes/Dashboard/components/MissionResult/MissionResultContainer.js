import { connect } from 'react-redux'

import {selectDirective} from 'fbw-platform-common/reducers/Mission/selectDirective'
import {selectTarget} from 'fbw-platform-common/reducers/Mission/selectTarget'
import {getStudentResult} from 'fbw-platform-common/reducers/Result/getStudentResult'
import {createMissions} from 'fbw-platform-common/reducers/edit-mission/createMission'
import {getMapping, getUser} from 'fbw-platform-common/selectors'
import {getCurrentCourse, getRoster} from 'fbw-platform-common/selectors/course'

import MissionResult from './MissionResult'
import {parseResults, computeGrades} from '../../selectors/resultsSelector'



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickDirective: (directiveIndex) => dispatch(selectDirective(directiveIndex)),
    onClickTarget: (target) => dispatch(selectTarget(target)),
    onSelectStudentResult: (student, mission, user) => {
      // console.log('onSelectStudentResult', student, mission, user)
      dispatch(getStudentResult(student, mission, user))
    },
    onCreateMissions: (newMissions, course, user) => {
      dispatch(createMissions(newMissions, course, user));
    },
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    user: getUser(state),
    grades: computeGrades(ownProps.mission, ownProps.records, getRoster(state)),
    currentDirectiveIndex: state.mission.currentDirectiveIndex,
    currentTarget: state.mission.currentTarget,
    currentMission: state.mission.currentMission,
    currentCourse: getCurrentCourse(state),
    missions: state.mission.missions,
    outcomes: getMapping(state).outcomes,
    view: state.view,
    isGetResultsInProgress: state.result && state.result.isGetResultsInProgress,
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionResult)
