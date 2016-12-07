import { connect } from 'react-redux'
import Login from './Login'

import { logInUser } from '../../reducers/User/logInUser'
import { updateUsername } from '../../reducers/User/updateUsername'
import { setVisitorLogin } from '../../reducers/User/setVisitorLogin'
import { setD2LAuthenticatedUrl } from '../../reducers/User/setD2LAuthenticatedUrl'
import { setEnrolledSubjects } from '../../reducers/Subject/setEnrolledSubjects'

import { logOutUser } from '../../reducers/User/logOutUser'

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.user.form ? state.user.form.username : null,
    isLoginInProgress: state.user.user ? state.user.isLoginInProgress : false,
    currentUsername: state.user.user ? state.user.user.displayName : null,
    isVisitor: state.user.user ? state.user.user.isVisitor : false
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
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)
