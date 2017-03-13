import { connect } from 'react-redux'
import {browserHistory} from 'react-router'
import slug from 'slug'

import Missions from './Missions'

import {getMapping} from 'fbw-platform-common/reducers/Mapping/getMapping'
import {getMissions} from 'fbw-platform-common/reducers/Mission/getMissions'

import {changeView} from '../../reducers/view'
import {getResults, getResultsBulk} from 'fbw-platform-common/reducers/Result/getResults'
import {getUser} from 'fbw-platform-common/selectors'
import {getRoster, getCurrentCourse} from 'fbw-platform-common/selectors/course'
import {editMission} from 'fbw-platform-common/reducers/edit-mission/editMission'
import {selectMission} from 'fbw-platform-common/reducers/Mission/selectMission'
import {deleteMission} from 'fbw-platform-common/reducers/edit-mission/deleteMission'
import {clickAddMission} from 'fbw-platform-common/reducers/edit-mission/clickAddMission'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMissions: data => dispatch(getMissions(data)),
    getMapping: data => dispatch(getMapping(data)),
    onClickRefreshResults: (mission, user) => {
      // this gets results for the mission that was clicked
      dispatch(getResults({mission, user}));
      // we also want to get the results for all of its phase 2 missions
      dispatch(getResultsBulk({missions: mission.leadsToMissions, user}));
    },
    onClickEditMission: (mission, user) => {
      // console.log('clicked edit mission', mission, directives);
      dispatch(changeView({name: 'edit-mission', mission: mission}));
      dispatch(editMission(mission));
    },
    onClickMission: (mission, user) => {
      console.log('clicked mission', mission, user);

      // this gets results for the mission that was clicked
      dispatch(getResults({mission, user}));
      // we also want to get the results for all of its phase 2 missions
      dispatch(getResultsBulk({missions: mission.leadsToMissions, user}));

      dispatch(selectMission(mission));

      browserHistory.push(`/dashboard/${slug(mission.displayName)}`)
    },
    onClickAddMission: (missions, user) => {
      dispatch(clickAddMission());

      browserHistory.push(`/mission-edit?view=new`, )
    },
    onClickEditMission: (mission, user) => {
      // console.log('clicked edit mission', mission, directives);
      dispatch(editMission(mission));

      browserHistory.push(`/mission-edit?view=edit`, )
    },
    onClickDeleteMission: (mission, user) => {
      dispatch(deleteMission(mission, user))
    },
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('state in MissionsContainer?', state, getUser(state))

  let currentMission = state.mission ? state.mission.currentMission : null;
  return {
    user: getUser(state),
    course: getCurrentCourse(state),
    view: state.view,
    roster: getRoster(state),
    missions: state.mission.missions,
    resultsByMission: state.result.resultsByMission,
    isGetMissionsInProgress: state.mission.isGetMissionsInProgress,
    isGetResultsInProgress: state.result && state.result.isGetResultsInProgress,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Missions)
