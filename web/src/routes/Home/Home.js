import React, {Component} from 'react'
import { browserHistory } from 'react-router'

import LoadingBox from '../../components/LoadingBox'
import MissionForm from '../../components/MissionForm/'
import NavBar from '../../components/NavBar'
import _ from 'lodash'
import DashboardContainer from '../Dashboard/'

import Missions from './views/Missions'

import {missionConfig} from 'fbw-platform-common/reducers/Mission'


import './Home.styles.css'

class Home extends Component {
  static propTypes = {
    onClickCourse: React.PropTypes.func.isRequired,
    onClickMission: React.PropTypes.func.isRequired,
    onClickAddMission: React.PropTypes.func.isRequired,
    onClickEditMission: React.PropTypes.func.isRequired,
    onGetMissions: React.PropTypes.func.isRequired,
    courses: React.PropTypes.array,
    missions: React.PropTypes.array,
    currentMission: React.PropTypes.object,
    currentCourse: React.PropTypes.object,
  }

  render() {
    let props = this.props;

    let view;
    if (props.view.name.startsWith('dashboard')) {
      view = (
        <div>
          <DashboardContainer.component></DashboardContainer.component>
        </div>
      )
    }  else if (props.view.name === 'add-mission' || props.view.name === 'edit-mission') {
      view = (
        <div>
          <MissionForm />
        </div>
      )
    }

    return (
      <div>
        <NavBar username={props.username} logout={this._logout}/>

        <div className="medium-4 large-3 columns">
          <Missions missions={this._getVisibleMissions()} onClickMission={this._onClickMission} />
          {/* <SideBar {...props} _onClickCourse={this._onClickCourse}/> */}
        </div>

        <div className="medium-8 large-9 columns">
          {view}
        </div>
      </div>
    )
  }

  _getVisibleMissions() {
    return _.filter(this.props.missions, {type: missionConfig.PHASE_I_MISSION_TYPE});
  }

  _onClickMission(mission) {

  }


  _logout = () => {
    this.props.logout();
    browserHistory.push('/login')
  }
}

export default Home
