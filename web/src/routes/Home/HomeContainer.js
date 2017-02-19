import { connect } from 'react-redux'
import Home from './Home'

import {browserHistory} from 'react-router'

import {getMapping} from 'fbw-platform-common/reducers/Mapping/getMapping'

import {selectCourse} from 'fbw-platform-common/reducers/Course/selectCourse'
import {getItems} from 'fbw-platform-common/reducers/Course/getItems'
import {getD2LClassRoster} from 'fbw-platform-common/reducers/Course/getD2LClassRoster'

import {getMissions} from 'fbw-platform-common/reducers/Mission/getMissions'
import {selectMission} from 'fbw-platform-common/reducers/Mission/selectMission'

import {deleteMission} from 'fbw-platform-common/reducers/edit-mission/deleteMission'
import {addMission} from 'fbw-platform-common/reducers/edit-mission/addMission'
import {editMission} from 'fbw-platform-common/reducers/edit-mission/editMission'

import {getResults} from 'fbw-platform-common/reducers/Result/getResults'

import {logOutUser} from 'fbw-platform-common/reducers/Login/logOutUser'

import {changeView} from '../../reducers/view'

import {getUser} from 'fbw-platform-common/selectors'
import {getCurrentCourse} from 'fbw-platform-common/selectors/course'



const mapStateToProps = (state, ownProps) => {
  console.log('state in HomeContainer', state);
  // console.log('offeredId:', state.mission && state.mission.currentMission ? state.mission.currentMission.assessmentOfferedId : null)

  return {
    courses: state.course ? state.course.courses : [],
    currentCourse: getCurrentCourse(state),
    missions: state.mission ? state.mission.missions : [],
    currentMission: state.mission ? state.mission.currentMission : null,
    isGetMissionsInProgress: state.mission ? state.mission.isGetMissionsInProgress : null,
    view: state.view,
    username: getUser(state) ? getUser(state).username : null,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickCourse: (course, username) => {
      console.log('clicked course', course, username);
      // console.log('clicked course2', credentials, d2lToken, orgUnitId);

      dispatch(selectCourse(course));
      dispatch(getMissions({course, username}));
      // dispatch(getD2LClassRoster({url: d2lToken, orgUnitId, credentials}))

      dispatch(getMapping({course: course, entityTypes: ['outcome', 'module'], relationshipTypes: ['HAS_PARENT_OF', 'HAS_PREREQUISITE_OF']}));
      dispatch(getItems({course, username}));

      dispatch(changeView({name: 'dashboard.resultsView', mission: null}))      // true default
    },
    onGetMissions: (courseId) => dispatch(getMissions({subjectCourseId: courseId, username: null})),
    onClickMission: (mission, course) => {
      dispatch(getResults(mission, course));
      dispatch(selectMission(mission));
      dispatch(changeView({name: 'dashboard.resultsView', mission: mission}))      // true default
    },
    onClickAddMission: () =>
    {
      dispatch(changeView({name: 'add-mission'}))
      dispatch(addMission());
      // browserHistory.push('/missions/new')
    },
    onClickEditMission: (mission, directives) => {
      console.log('clicked edit mission', mission, directives);
      dispatch(changeView({name: 'edit-mission', mission: mission}));
      dispatch(editMission(mission, directives));
    },
    onClickDeleteMission: (mission, courseId) => {
      dispatch(deleteMission(mission, courseId))
    },
    logout: () => {
      dispatch(logOutUser())
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Home)
