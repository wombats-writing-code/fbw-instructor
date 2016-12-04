// Login Container

import { connect } from 'react-redux'

import { logInUser } from '../reducers/Login/logInUser'
import { updateUsername } from '../reducers/Login/updateUsername'
import { setVisitorLogin } from '../reducers/Login/setVisitorLogin'
import { setD2LAuthenticatedUrl } from '../reducers/Login/setD2LAuthenticatedUrl'
import { setEnrolledSubjects } from '../reducers/Subject/setEnrolledSubjects'

import { logOutUser } from '../reducers/Login/logOutUser'
import { resetMissionState } from '../reducers/Mission/resetMissionState'
import { resetSubjectState } from '../reducers/Subject/resetSubjectState'

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.login.form ? state.login.form.username : null,
    isLoginInProgress: state.username ? state.login.isLoginInProgress : false,
    currentUsername: state.username ? state.username : null,
    isVisitor: state.login.isVisitor ? state.login.isVisitor : false
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSetD2LAuthenticatedUrl: (data) => dispatch(setD2LAuthenticatedUrl(data)),
    onSetEnrolledSubjects: (bankIds) => dispatch(setEnrolledSubjects(bankIds)),
    updateUsername: (username) => dispatch(updateUsername(username)),
    onSetVisitorLogin: (data) => dispatch(setVisitorLogin(data)),
    login: (school, username) => dispatch(logInUser(school, username)),
    logout: () => {
      dispatch(logOutUser())
      dispatch(resetMissionState())
      dispatch(resetSubjectState())
    }
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
