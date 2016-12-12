'use strict';

import React, {Component} from 'react'

import moment from 'moment'
import ResultsView from './containers/ResultsViewContainer'
import RecommendMission from './containers/RecommendMissionContainer'

import LoadingBox from '../../components/LoadingBox'
import './Dashboard.scss'

class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      isExpanded: false
    };
  }

  render() {
    let props = this.props;

    let phaseIView, phaseIIView, recommendationBody;
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

      if (!props.mission.hasSpawnedFollowOnPhase && this.state.isExpanded) {
        recommendationBody = <RecommendMission recommendation={this.props.recommendation}/>
      }
    }

    let spawnButtonText;
    if (this.props.isSpawnInProgress) {
      spawnButtonText = 'Working...';
    } else if (this.props.hasSpawnedFollowOnPhase) {
      spawnButtonText = 'Missions launched';
    } else {
      spawnButtonText = 'Launch Phase II Missions!';
    }

    let expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';

    let recommendationBar;
    if (props.mission &&
        !props.mission.hasSpawnedFollowOnPhase) {
      let now = moment.utc()
      recommendationBar = (
        <div className="summary-bar flex-container align-center">
          <p className="summary__mission-name">
            Recommendation
            <span className="summary__mission-name-type">Launch Phase II mission</span>
          </p>

          <div className="summary-blurb flex-container align-center">
            <p className="summary__number">{props.recommendation ? props.recommendation.students.length : 0}</p>
            <p className="summary__text">students to get Phase II</p>
          </div>

          <button className="button spawn-button small"
                  disabled={props.isSpawnInProgress}
                  onClick={() => this.props.onSpawnPhaseIIMissions(this.props.recommendation.students,
                    this.props.currentBankId,
                    this.props.mission,
                    this.props.spawnDate || now)}>
            {spawnButtonText}
          </button>

          <button className="expand-collapse-button"
                  onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
            {expandCollapseButtonText}
          </button>

        </div>
      )
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

        <div className="clearfix columns">
          {recommendationBar}

          {recommendationBody}
        </div>

        <div className="clearfix">
          {loadingBox}
        </div>

      </div>

    )
  }

}

export default Dashboard
