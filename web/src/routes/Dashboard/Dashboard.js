import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import moment from 'moment'
import $ from 'jquery'
import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import LoadingBox from 'fbw-platform-common/components/loading-box/web/'
import {parseResults} from './selectors/resultsSelector'

import MissionResult from './containers/MissionResultContainer'
import './Dashboard.scss'

class Dashboard extends Component {

  constructor() {
    super();

    this.state = {
      phaseIIPositionStyle: null
    }
  }

  componentDidMount() {
    // let timelineHeight =
    setTimeout(() => {
      let phase2Results = $('#phase2Results').position();
      if (phase2Results) {
        this.setState({
          phaseIIPositionStyle: {
            transform: `translateY(${phase2Results.top}px)`
          }
        });
      }

      // console.log('phaseIIPositionStyle', phase2Results.top);
    }, 300);

    if (!this.props.resultsByMission) {
      this.props.onClickRefreshResults(this.props.mission, this.props.user)
    }
  }

  render() {
    let props = this.props;

    let loadingBox;
    if (this.props.isGetResultsInProgress) {
      loadingBox = LoadingBox('enter-active')
    } else {
      loadingBox = LoadingBox('enter')
    }

    if (!props.resultsByMission) {
      return (<div className="row">
        {loadingBox}
      </div>)
    };


    let phaseIResults, recommendationView;
    if (props.mission && !this.props.isGetResultsInProgress && !this.props.isGetMissionsInProgress) {
      phaseIResults = (
          <div>
            <p className="dashboard__timeline-point__text">
              <b>Phase I</b> &thinsp;
              {moment(props.mission.startTime).format('ddd, MMM D [at] ha')}
              &mdash;
              {moment(props.mission.deadline).format('ddd, MMM D [at] ha')}
            </p>
            <MissionResult results={this._getResults(props.mission, missionConfig.PHASE_I_MISSION_TYPE)}
                          records={this._getRecords(props.mission, missionConfig.PHASE_I_MISSION_TYPE)}
                          mission={props.mission}
                          isGetResultsInProgress={props.isGetResultsInProgress}
                        />
          </div>
        )
    }

    let phase2Missions = _.map(props.mission.leadsToMissions, id => _.find(props.missions, {id: id}));
    // console.log('phaseIIMissions', phase2Missions)

    let phase2Results;
    if (phase2Missions && phase2Missions.length > 0) {
      phase2Results = (
        <div>
          <p className="dashboard__timeline-point__text">
          <b>Phase II</b> &thinsp;
          <span className=" ">
            {moment(this._getLeadsToMission(props.mission).startTime).format('ddd, MMM D [at] ha')}
              &mdash;
            {moment(this._getLeadsToMission(props.mission).deadline).format('ddd, MMM D [at] ha')}
          </span>
        </p>
          <MissionResult results={this._getResults(this.props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
                    mission={this.props.mission}
                    isGetResultsInProgress={props.isGetResultsInProgress}/>
        </div>
      )

    } else if (!this.props.isGetMissionsInProgress) {
      phase2Results = (
        <p className="dashboard__timeline-point__text">
          <b>Phase II</b> &thinsp;
          No Phase II missions have been launched from this one.
        </p>
      )
    }

    // console.log('isGetResultsInProgress', this.props.isGetResultsInProgress)

    return (
      <div className="">
        <div className="row dashboard__title">
          <div className="flex-container space-between align-center">
            <p className="dashboard__mission-name">
              {this.props.mission ? this.props.mission.displayName : ''} &nbsp;
            </p>
            <button className="button refresh-button"
                    disabled={this.props.isGetResultsInProgress}
                    onClick={() => this.props.onClickRefreshResults(props.mission, props.user)}>
              {this.props.isGetResultsInProgress ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <hr />
        </div>

        <div className="row ">
          <div className="mission-result-container">
            {phaseIResults}
          </div>

          <div className="mission-result-container" id="phase2Results">
            {phase2Results}
          </div>
        </div>

        <div className="row">
          {loadingBox}
        </div>
      </div>
    )
  }

  _getLeadsToMission(mission) {
    let leadsToMission = _.find(this.props.missions, {id: mission.leadsToMissions[0]});
    if (mission.leadsToMissions.length > 0 && !leadsToMission) {
      throw new Error('Current mission has leadsToMissions but not found in list of missions. Check DB.')
    }

    return leadsToMission
  }

  _getRecords(mission, getForMissionType) {
    let records;
    if (getForMissionType === missionConfig.PHASE_I_MISSION_TYPE) {
      records = this.props.resultsByMission[mission.id];

      // console.log('records for phase 1', mission.displayName, records)
    } else if (getForMissionType === missionConfig.PHASE_II_MISSION_TYPE) {
      records = _.compact(_.flatten(_.map(mission.leadsToMissions, id => this.props.resultsByMission[id])));

      // console.log('records for phase 2', mission.displayName, records)
    } else {
      throw new Error('You must specify for Phase I or Phase II you want to get records')
    }

    return records;
  }

  _getResults(mission, getForMissionType) {
    let records = this._getRecords(mission, getForMissionType);
    let results = parseResults(records, this.props.roster);;

    return results;
  }

}

export default Dashboard
