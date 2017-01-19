import React, {Component} from 'react'
import { browserHistory } from 'react-router'

import LoadingBox from '../../components/LoadingBox'
import MissionForm from '../../components/MissionForm/'
import SideBar from '../../components/SideBar'
import NavBar from '../../components/NavBar'
import _ from 'lodash'
import DashboardContainer from '../Dashboard/'

import './Home.styles.css'

class Home extends Component {
  static propTypes = {
    onClickBank: React.PropTypes.func.isRequired,
    onClickMission: React.PropTypes.func.isRequired,
    onClickAddMission: React.PropTypes.func.isRequired,
    onClickEditMission: React.PropTypes.func.isRequired,
    onGetMissions: React.PropTypes.func.isRequired,
    banks: React.PropTypes.array,
    missions: React.PropTypes.array,
    currentMission: React.PropTypes.object,
    currentBank: React.PropTypes.object,
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    if (this.props.privateBankId &&
        !this.props.missions &&
        !this.props.isGetMissionsInProgress) {
      this.props.onGetMissions(this.props.currentBank.id)
    }
  }
      // this.props.onLoadMissions(this.props.currentBank, this.props.enrolledBanks)

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
        <NavBar logout={this._logout}/>

        <div className="medium-4 large-3 columns">
          <SideBar {...props} _onClickBank={this._onClickBank}/>
        </div>

        <div className="medium-8 large-9 columns">
          {view}
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
