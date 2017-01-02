import { connect } from 'react-redux'
import D2LCallback from './D2LCallback'

import { setD2LAuthenticatedUrl } from 'fbw-platform-common/reducers/Login/setD2LAuthenticatedUrl'
import { receiveBanks } from 'fbw-platform-common/reducers/Bank/getBanks'
import { logInUser } from 'fbw-platform-common/reducers/Login/logInUser'

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSetD2LAuthenticatedUrl: url => dispatch(setD2LAuthenticatedUrl(url)),
    onReceiveBanks: banks => dispatch(receiveBanks(banks)),
    login: (school, username) => dispatch(logInUser(school, username))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(D2LCallback)
