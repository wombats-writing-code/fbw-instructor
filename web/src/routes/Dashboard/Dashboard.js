'use strict';

import React, {Component} from 'react'

import moment from 'moment'
import ResultsView from './containers/ResultsViewContainer'
import GradesView from './containers/GradesViewContainer'
import RecommendMission from './containers/RecommendMissionContainer'

import LoadingBox from '../../components/LoadingBox'
import './Dashboard.scss'

class Dashboard extends Component {

  render() {
    let props = this.props;

    if (!props.mission) return null;

    let phaseIView, phaseIIView, recommendationView, gradesView;
    if (props.mission && (!this.props.isGetPhaseIResultsInProgress && !this.props.isGetPhaseIIResultsInProgress)) {
      phaseIView = (<ResultsView mission={this.props.mission}
                                missionType="Phase I"
                                isGetResultsInProgress={this.props.isGetPhaseIResultsInProgress}
                    />)

      phaseIIView = props.mission.hasSpawnedFollowOnPhase ? (
                    <ResultsView  mission={this.props.mission}
                                  missionType="Phase II"
                                  isGetResultsInProgress={this.props.isGetPhaseIIResultsInProgress}
                    />) : null;

      if (!props.mission.hasSpawnedFollowOnPhase) {
        recommendationView = <RecommendMission />
      }

      // points are available in real-time as soon as Phase II is spawned
      if (props.mission.hasSpawnedFollowOnPhase) {
        gradesView = <GradesView />
      }
    }

    let loadingBox;
    if (this.props.isGetPhaseIResultsInProgress || this.props.isGetPhaseIIResultsInProgress) {
      loadingBox = LoadingBox('enter-active')
    } else {
      loadingBox = LoadingBox('enter')
    }


    return (
      <div className="columns">
        <div className="row">
          <p className="mission-name">
            {this.props.mission ? this.props.mission.displayName.text : ''} &nbsp;
            <span className="light">{moment(props.mission.startTime).format('ddd, MMM D [at] hA')} &mdash; {moment(props.mission.deadline).format('ddd, MMM D [at] hA')}</span>
          </p>
        </div>
        <div className="row">
          {phaseIView}
        </div>
        <div className="row">
          {phaseIIView}
        </div>

        <div className="row">
          {recommendationView}
        </div>

        <div className="row">
          {gradesView}
        </div>

        <div className="row">
          {loadingBox}
        </div>

      </div>

    )
  }

}

export default Dashboard
