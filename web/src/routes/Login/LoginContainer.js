import { connect } from 'react-redux'
import Login from './Login'

import { updateUsername } from '../../reducers/User/updateUsername'
import { setVisitorLogin } from '../../reducers/User/setVisitorLogin'
import { setBanks } from '../../reducers/Bank/setBanks'

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
    updateUsername: (username) => dispatch(updateUsername(username)),
    login: (school, username) => {
      dispatch(setBanks(null))
      dispatch(setVisitorLogin(school, username))
    },
    logout: () => {
      dispatch(logOutUser())
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)
