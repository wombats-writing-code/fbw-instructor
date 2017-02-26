import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import _ from 'lodash'

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import LoadingBox from 'fbw-platform-common/components/loading-box/web/'
import MissionForm from '../../components/MissionForm/'
import NavBar from '../../components/NavBar'
import Dashboard from '../Dashboard/'

import Courses from './views/Courses'
import Missions from './views/Missions'



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
          <Dashboard />
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
        <NavBar user={props.user} logout={this._logout}/>

        <div className="medium-4 large-3 columns">
          <Courses courses={props.courses}
                    onClickCourse={(course) => props.onClickCourse(course, props.user, props.authenticatedUrl)} />

          <Missions missions={this._getVisibleMissions()}
                    isGetMissionsInProgress={this.props.isGetMissionsInProgress}
                    onClickMission={(mission) => this.props.onClickMission(mission, props.user)}
                    onClickAddMission={() => this.props.onClickAddMission(this._getVisibleMissions(), props.user)}
                    onClickDeleteMission={(mission) => this.props.onClickDeleteMission(mission, props.user)}
                  />
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
