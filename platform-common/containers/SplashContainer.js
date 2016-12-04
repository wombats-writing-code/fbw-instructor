// Splash container
import { connect } from 'react-redux'

import { getUsername } from '../reducers/Login/getUsername'
import { getEnrolledSubjects } from '../reducers/Subject/getEnrolledSubjects'
import { getSelectedSubject } from '../reducers/Subject/getSelectedSubject'
import { getSavedOutcomes } from '../reducers/Outcome/getSavedOutcomes'

const mapStateToProps = (state, ownProps) => {
  // console.log('state', state)
  return {
    username: state.login.username ? state.login.username : null,
    initialized: state.login.initialized ? state.login.initialized : false
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onInitialize: () => {
      dispatch(getEnrolledSubjects())
      dispatch(getSelectedSubject())
      dispatch(getSavedOutcomes())
      dispatch(getUsername())
    }
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
