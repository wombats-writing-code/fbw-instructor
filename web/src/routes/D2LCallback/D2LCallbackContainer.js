import { connect } from 'react-redux'
import D2LCallback from './D2LCallback'

import { setD2LAuthenticatedUrl } from '../../reducers/User/setD2LAuthenticatedUrl'
import { setEnrolledSubjects } from '../../reducers/Subject/setEnrolledSubjects'

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSetD2LAuthenticatedUrl: url => dispatch(setD2LAuthenticatedUrl(url)),
    onSetEnrolledSubjects: data => dispatch(setEnrolledSubjects(data))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(D2LCallback)
