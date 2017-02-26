import { connect } from 'react-redux'
import {browserHistory} from 'react-router'

import Home from './Home'

const D2LConfig = require('../../D2LConfig');

import {getMapping} from 'fbw-platform-common/reducers/Mapping/getMapping'

import {selectCourse} from 'fbw-platform-common/reducers/Course/selectCourse'
import {getItems} from 'fbw-platform-common/reducers/Course/getItems'
import {getD2LClassRoster} from 'fbw-platform-common/reducers/Course/getD2LClassRoster'

import {getMissions} from 'fbw-platform-common/reducers/Mission/getMissions'
import {selectMission} from 'fbw-platform-common/reducers/Mission/selectMission'

import {deleteMission} from 'fbw-platform-common/reducers/edit-mission/deleteMission'
import {editMission} from 'fbw-platform-common/reducers/edit-mission/editMission'

import {getResults, getResultsBulk} from 'fbw-platform-common/reducers/Result/getResults'

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
    isGetMappingInProgress: state.mapping.isGetMappingInProgress,
    view: state.view,
    user: getUser(state),
    authenticatedUrl: state.login.user.authenticatedUrl
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickCourse: (course, user, authenticatedUrl) => {
      // console.log('clicked course', course, user);
      // console.log('clicked course2', D2LConfig, d2lToken, orgUnitId);
      dispatch(selectCourse(course));
      dispatch(getMissions({course, user: user, all: true}));
      dispatch(getD2LClassRoster({url: authenticatedUrl, courseId: course.Identifier, D2LConfig}))

      dispatch(getMapping({
        course: course,
        entityTypes: ['outcome', 'module'],
        relationshipTypes: ['HAS_PARENT_OF', 'HAS_PREREQUISITE_OF'],
        user: user
      }));
      dispatch(getItems({course, user: user}));

      dispatch(changeView({name: 'dashboard.resultsView', mission: null}))      // true default
    },
    onGetMissions: (courseId) => dispatch(getMissions({subjectCourseId: courseId, username: null})),
    onClickMission: (mission, user) => {
      // console.log('clicked mission', mission);

      // this gets results for the mission that was clicked
      dispatch(getResults({mission, user}));
      // we also want to get the results for all of its phase 2 missions
      dispatch(getResultsBulk({missions: mission.leadsToMissions, user}));

      dispatch(selectMission(mission));
      dispatch(changeView({name: 'dashboard.resultsView', mission: mission}))      // true default
    },
    onClickAddMission: (missions, user) => {
      dispatch(changeView({name: 'add-mission'}))
    },
    onClickEditMission: (mission, directives) => {
      // console.log('clicked edit mission', mission, directives);
      dispatch(changeView({name: 'edit-mission', mission: mission}));
      dispatch(editMission(mission, directives));
    },
    onClickDeleteMission: (mission, user) => {
      dispatch(deleteMission(mission, user))
    },
    logout: () => {
      dispatch(logOutUser())
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Home)
