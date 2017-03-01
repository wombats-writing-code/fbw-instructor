import React, {Component} from 'react'
import moment from 'moment'

import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import ResultsView from './containers/ResultsViewContainer'
import LoadingBox from 'fbw-platform-common/components/loading-box/web/'
import {parseResults} from './selectors/resultsSelector'
import './Dashboard.scss'

class Dashboard extends Component {

  render() {
    let props = this.props;

    if (!props.mission) return null;

    let resultsView, recommendationView;
    if (props.mission && !this.props.isGetResultsInProgress && !this.props.isGetMissionsInProgress) {
      resultsView = (
        <div>
          <p className="results__title flex-container space-between">
            <span>Phase I</span>
            <span className=" ">
              {moment(props.mission.startTime).format('ddd, MMM D [at] ha')}
              &mdash;
              {moment(props.mission.deadline).format('ddd, MMM D [at] ha')}
            </span>
          </p>
          <ResultsView results={this._getResults(props.mission)}
                      records={this._getRecords(props.mission)}
                        mission={props.mission}
                        isGetResultsInProgress={props.isGetResultsInProgress}
                      />
        </div>
        )

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
          <p className="results__title flex-container space-between">
            <span>Phase II</span>
            <span className=" ">
              {moment(this._getLeadsToMission(props.mission).startTime).format('ddd, MMM D [at] ha')}
                &mdash;
              {moment(this._getLeadsToMission(props.mission).deadline).format('ddd, MMM D [at] ha')}
            </span>
          </p>        <ResultsView results={this._getResults(this.props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
                    mission={this.props.mission}
                    isGetResultsInProgress={props.isGetResultsInProgress}/>
        </div>

      )

    } else if (!this.props.isGetMissionsInProgress) {
      phase2Summary = (
      <p className="phase-2-prompt">
        No Phase II missions have been launched from this one.
      </p>)
    }

    return (
      <div className="columns">
        <div className="dashboard-bar flex-container space-between align-center">
          <p className="mission-name">
            {this.props.mission ? this.props.mission.displayName : ''} &nbsp;
          </p>
          <button className="button refresh-button"
                  disabled={this.props.isGetResultsInProgress}
                  onClick={() => this.props.onClickRefreshResults(props.mission, props.user)}>
            {this.props.isGetResultsInProgress ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="row">
          {resultsView}
        </div>

        <div className="row">
          {phase2Summary}
        </div>

        <div className="row">
          {loadingBox}
        </div>

      </div>
    )
  }

  _getLeadsToMission(mission) {
    return _.find(this.props.missions, {id: mission.leadsToMissions[0]});
  }

  _getRecords(mission) {
    let records;
    if (mission.type === missionConfig.PHASE_I_MISSION_TYPE) {
      records = this.props.resultsByMission[mission.id];

    } else {
      records = _.compact(_.flatten(_.map(mission.leadsToMissions, id => this.props.resultsByMission[id])));
    }

    return records;
  }

  _getResults(mission) {
    let records = this._getRecords(mission);
    let results = parseResults(records, this.props.roster);;

    return results;
  }

}

export default Dashboard
