'use strict';

import React, {Component} from 'react'

import ResultsView from './containers/ResultsViewContainer'
import RecommendMission from './containers/RecommendMissionContainer'

import LoadingBox from '../../components/LoadingBox'
import './Dashboard.scss'

class Dashboard extends Component {

  componentDidMount() {
  }

  render() {
    let props = this.props;

    let phaseIView, phaseIIView, recommendMission;
    if (props.mission && (!this.props.isGetPhaseIResultsInProgress && !this.props.isGetPhaseIIResultsInProgress)) {
      phaseIView = (<ResultsView mission={this.props.mission}
                                missionType="Phase I"
                                isGetResultsInProgress={this.props.isGetPhaseIResultsInProgress}
                    />)

      phaseIIView =  (
                    <ResultsView  mission={this.props.mission}
                                  missionType="Phase II"
                                  isGetResultsInProgress={this.props.isGetPhaseIIResultsInProgress}
                    />)

      if (!props.mission.hasSpawnedFollowOnPhase) {
        recommendMission = <RecommendMission recommendation={this.props.recommendation}/>
      }
    }

    let loadingBox;
    if (this.props.isGetPhaseIResultsInProgress || this.props.isGetPhaseIIResultsInProgress) {
      loadingBox = LoadingBox('enter-active')
    } else {
      loadingBox = LoadingBox('enter')
    }


    return (
      <div className="row">
        {phaseIView}
        {phaseIIView}

        {recommendMission}
        <div className="clearfix">
          {loadingBox}
        </div>

      </div>

    )
  }

}

export default Dashboard
