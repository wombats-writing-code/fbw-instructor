import { connect } from 'react-redux'
import Dashboard from './Dashboard'

import { changeView, changeMouseOver, changeClick } from '../../reducers/view'
import { getResults, getResultsBulk } from '@wombats-writing-code/fbw-platform-common/reducers/Result/getResults'
import { getUser } from '@wombats-writing-code/fbw-platform-common/selectors'
import { getCurrentCourse, getRoster } from '@wombats-writing-code/fbw-platform-common/selectors/course'
import { editMission } from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/editMission'
import { resetDashboardMission } from '@wombats-writing-code/fbw-platform-common/reducers/Mission/resetDashboardMission'
import { createMissions } from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/createMission'
import {
  clickEditMissionDates
} from '@wombats-writing-code/fbw-platform-common/reducers/edit-mission/clickEditMissionDates'


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
    onClickEditMissionDates: mission => dispatch(clickEditMissionDates(mission)),
    onResetDashboardMission: (mission) => dispatch(resetDashboardMission(mission)),
    onCreateMissions: (newMissions, course, user) => dispatch(createMissions(newMissions, course, user)),
  }
}

const mapStateToProps = (state, ownProps) => {

  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    currentCourse: getCurrentCourse(state),
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
