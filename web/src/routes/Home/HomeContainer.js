import { connect } from 'react-redux'
import {browserHistory} from 'react-router'

import Home from './Home'

const D2LConfig = require('../../D2LConfig');

import {selectCourse} from 'fbw-platform-common/reducers/Course/selectCourse'
import {getItems} from 'fbw-platform-common/reducers/Course/getItems'
import {getD2LClassRoster} from 'fbw-platform-common/reducers/Course/getD2LClassRoster'
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
      dispatch(getD2LClassRoster({url: authenticatedUrl, courseId: course.Identifier, D2LConfig}))
      dispatch(getItems({course, user: user}));

      // dispatch(changeView({name: 'dashboard.resultsView', mission: null}))      // true default
      browserHistory.push('/missions')
    },
    onGetMissions: (courseId) => dispatch(getMissions({subjectCourseId: courseId, username: null})),
    logout: () => {
      dispatch(logOutUser())
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Home)
