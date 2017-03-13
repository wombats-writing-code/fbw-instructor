import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import _ from 'lodash'

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import LoadingBox from 'fbw-platform-common/components/loading-box/web/'
import MissionForm from '../../components/MissionForm/'

import Courses from './views/Courses'

class Home extends Component {
  render() {
    let props = this.props;

    let view;
    if (props.view.name === 'add-mission' || props.view.name === 'edit-mission') {
      view = (
        <div>
          <MissionForm currentMission={this.props.currentMission} />
        </div>
      )
    }

    return (
      <div>
        <div className="medium-4 large-4 columns end">
          <Courses courses={props.courses} currentCourse={props.currentCourse}
                    onClickCourse={(course) => props.onClickCourse(course, props.user, props.authenticatedUrl)} />

        </div>

      </div>
    )
  }


  _logout = () => {
    this.props.logout();
    browserHistory.push('/login')
  }
}

export default Home
