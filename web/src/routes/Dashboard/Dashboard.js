'use strict';

import React, {Component} from 'react'
import moment from 'moment'

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import ResultsView from './containers/ResultsViewContainer'
import GradesView from './containers/GradesViewContainer'
import LoadingBox from '../../components/LoadingBox'
import {parseResults} from './selectors/resultsSelector'
import './Dashboard.scss'

class Dashboard extends Component {

  render() {
    let props = this.props;

    if (!props.mission) return null;

    let resultsView, recommendationView, gradesView;
    if (props.mission && !this.props.isGetResultsInProgress) {
      resultsView = (
        <div>
          <p className="results__title">Phase I</p>
          <ResultsView results={this._getResults(props.mission, missionConfig.PHASE_I_MISSION_TYPE)}
                                  mission={props.mission}
                                  isGetResultsInProgress={props.isGetResultsInProgress}
                      />
        </div>
        )


      gradesView = <GradesView />
    }


    let loadingBox;
    if (this.props.isGetResultsInProgress) {
      loadingBox = LoadingBox('enter-active')
    } else {
      loadingBox = LoadingBox('enter')
    }

    let phase2Missions = _.map(props.mission.leadsToMissions, id => _.find(props.missions, {id: id}));
    // console.log('phaseIIMissions', phase2Missions)

    let phase2Summary;
    if (phase2Missions && phase2Missions.length > 0) {
      phase2Summary = (
        <div>
        <p className="results__title">Phase II</p>
        <ResultsView results={this._getResults(this.props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
                    mission={this.props.mission}
                    isGetResultsInProgress={props.isGetResultsInProgress}/>
        </div>

      )
    } else {
      <p className="phase-2-summary">
      Phase II has not been launched. Go to Create a Mission.
      </p>
    }

    return (
      <div className="columns">
        <div className="row">
          <p className="mission-name">
            {this.props.mission ? this.props.mission.displayName : ''} &nbsp;
            <span className="light">{moment(props.mission.startTime).format('ddd, MMM D [at] hA')} &mdash; {moment(props.mission.deadline).format('ddd, MMM D [at] hA')}</span>
          </p>
        </div>

        <div className="row">
          {resultsView}
        </div>

        <div className="row">
          {phase2Summary}
        </div>

        {/* <div className="row">
          {gradesView}
        </div> */}

        <div className="row">
          {loadingBox}
        </div>

      </div>
    )
  }

  _getResults(mission, resultsType) {
    let results;
    if (resultsType === missionConfig.PHASE_I_MISSION_TYPE) {
      let records = this.props.resultsByMission[mission.id];

      results = parseResults(records, this.props.roster);

    } else {
      // we need to parse the records of all missions
      let records = _.compact(_.flatten(_.map(mission.leadsToMissions, id => this.props.resultsByMission[id])));

      console.log('all records for Phase 2', records);

      results = parseResults(records, this.props.roster);
    }

    return results;
  }

}

export default Dashboard
