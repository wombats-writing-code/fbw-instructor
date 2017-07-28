import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import {changeView, changeMouseOver, changeClick} from '../../reducers/view'
import {getResults, getResultsBulk} from 'fbw-platform-common/reducers/Result/getResults'
import {getUser} from 'fbw-platform-common/selectors'
import {getRoster} from 'fbw-platform-common/selectors/course'
import {editMission} from 'fbw-platform-common/reducers/edit-mission/editMission'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeView: (viewName) => dispatch(changeView({name: viewName})),
    onClickRefreshResults: (mission, user) => {
      // this gets results for the mission that was clicked
      dispatch(getResults({mission, user}));
      // we also want to get the results for all of its phase 2 missions
      dispatch(getResultsBulk({missions: mission.leadsToMissions, user}));
    },
    onClickMission: (mission, user) => {
      // console.log('clicked mission', mission);

      // this gets results for the mission that was clicked
      dispatch(getResults({mission, user}));
      // we also want to get the results for all of its phase 2 missions
      dispatch(getResultsBulk({missions: mission.leadsToMissions, user}));

      dispatch(selectMission(mission));
      dispatch(changeView({name: 'dashboard.resultsView', mission: mission}))      // true default
    },
    // onCreateMissions: (newMissions, course, user) => dispatch(createMissions(newMissions, course, user)),
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log('roster', getRoster(state))
  setTimeout(() => {
    // console.log('after refreshing')
    // console.log('state.result', state.result)
    // console.log('state.currentMission', state.mission.currentMission)

  }, 2000);

  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    user: getUser(state),
    view: state.view,
    roster: getRoster(state),
    mission: currentMission,
    missions: state.mission.missions,
    resultsByMission: state.result.resultsByMission,
    isGetMissionsInProgress: state.mission.isGetMissionsInProgress,
    isGetResultsInProgress: state.result && state.result.isGetResultsInProgress,
    isCreateMissionInProgress: state.editMission.isCreateMissionInProgress,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
