import { connect } from 'react-redux'
import slug from 'slug'

import { getMissions } from '../reducers/Mission/getMissions'
import { selectOpenMission } from '../reducers/Mission/selectOpenMission'
import { selectClosedMission } from '../reducers/Mission/selectClosedMission'

const mapStateToProps = (state, ownProps) => {
  // console.log('ownProps of MissionContainer', ownProps)
  // console.log('state of MissionContainer', state);

  return {
    missionName: ownProps.params ? ownProps.params.missionName : null,
    mission: ownProps.params && state.mission.missions ?
              _.find(state.mission.missions, m => slug(m.displayName.text) === slug(ownProps.params.missionName)) :
              null,
    hasQuestions: state.mission.currentMissionSections ? true : false,
    hasResults: typeof state.mission.resultsExistForUser !== 'undefined' ? state.mission.resultsExistForUser : true,
    bankId: state.subject.privateBankId ? state.subject.privateBankId : null,
    missions: state.mission ? state.mission.missions : null,
    isGetMissionsInProgress: state.mission ? state.mission.isGetMissionsInProgress : false,
    username: state.login ? state.login.username : null
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  // This seems redundant with MissionsContainer, but I think we need it
  //   in order to handle the "load specific mission page" scenario on the
  //   web side...basically the Mission component will need to load its
  //   own mission.
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
