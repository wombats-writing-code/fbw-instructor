import React, {Component} from 'react'
import Radium from 'radium'

import LoadingBox from '../../components/LoadingBox'
import DashboardContainer from '../Dashboard/'
import MissionForm from '../../components/MissionForm/'
import SideBar from '../../components/SideBar'
import NavBar from '../../components/NavBar'
import _ from 'lodash'


@Radium
class Home extends Component {
  static propTypes = {
    getMissions: React.PropTypes.func.isRequired,
    onClickMission: React.PropTypes.func.isRequired,
    onClickAddMission: React.PropTypes.func.isRequired,
    onClickEditMission: React.PropTypes.func.isRequired,
    banks: React.PropTypes.array,
    missions: React.PropTypes.array,
    currentMission: React.PropTypes.object,
    currentBank: React.PropTypes.object,
  }

  componentDidMount() {
    this.props.getBanks(_.map(this.props.enrolledBanks, 'id'));
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
        <NavBar />

        <div className="medium-4 large-3 columns">
          <SideBar {...props}/>
        </div>

        <div className="medium-8 large-9 columns">
          {view}
        </div>
      </div>
    )
  }
}

export default Home
