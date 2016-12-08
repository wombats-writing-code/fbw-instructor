import { connect } from 'react-redux'
import D2LCallback from './D2LCallback'

import { setD2LAuthenticatedUrl } from '../../reducers/User/setD2LAuthenticatedUrl'
import { setBanks } from '../../reducers/Bank/setBanks'
import { logInUser } from '../../reducers/User/logInUser'

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSetD2LAuthenticatedUrl: url => dispatch(setD2LAuthenticatedUrl(url)),
    onSetBanks: data => dispatch(setBanks(data)),
    login: (school, username) => dispatch(logInUser(school, username))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(D2LCallback)
