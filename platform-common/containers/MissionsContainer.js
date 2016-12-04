import { connect } from 'react-redux'

import { getMissions } from '../reducers/Mission/getMissions'
import { selectOpenMission } from '../reducers/Mission/selectOpenMission'
import { selectClosedMission } from '../reducers/Mission/selectClosedMission'

const mapStateToProps = (state, ownProps) => {
  // console.log('state', state);
  return {
    bankId: state.subject.privateBankId ? state.subject.privateBankId : null,
    missions: state.mission ? state.mission.missions : null,
    isGetMissionsInProgress: state.mission ? state.mission.isGetMissionsInProgress : false,
    username: state.login ? state.login.username : null
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSelectOpenMission: data => dispatch(selectOpenMission(data)),
    onSelectClosedMission: data => dispatch(selectClosedMission(data)),
    getMissions: data => dispatch(getMissions(data))
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
