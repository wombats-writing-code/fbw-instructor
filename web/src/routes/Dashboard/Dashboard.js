import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import moment from 'moment'
import $ from 'jquery'
import {missionConfig} from 'fbw-platform-common/reducers/Mission'
import LoadingBox from 'fbw-platform-common/components/loading-box/web/'
import {parseResults} from './selectors/resultsSelector'

import MissionResult from './components/MissionResult'
import './Dashboard.scss'

class Dashboard extends Component {

  constructor() {
    super();

    this.state = {
      phaseIIPositionStyle: null
    }
  }

  componentDidMount() {
    // make sure the dashboard shows Phase I missions only
    this.props.onResetDashboardMission(this.props.mission);

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
              {moment(props.mission.startTime).format('h:mm a ddd M/D')}
              &mdash;
              {moment(props.mission.deadline).format('h:mm a ddd M/D')}
            </p>
            <MissionResult result={this._getResults(props.mission, missionConfig.PHASE_I_MISSION_TYPE)}
                          records={this._getRecords(props.mission, missionConfig.PHASE_I_MISSION_TYPE)}
                          mission={props.mission}
                          isGetResultsInProgress={props.isGetResultsInProgress}
                        />
          </div>
        )
    }

    let phase2Missions = _.map(props.mission.leadsToMissions, id => _.find(props.missions, {id: id}));
    // console.log('phaseIIMissions', phase2Missions)

    let launchMissionButtonText;
    if (this.props.isCreateMissionInProgress) {
      launchMissionButtonText = 'Working...';

    } else if (phase2Missions && phase2Missions.length > 0) {
      launchMissionButtonText = 'Phase II launched';

    } else if ((!phase2Missions || phase2Missions.length === 0)) {
      launchMissionButtonText = 'Launch Phase II for everyone';
    }


    let phase2Results;
    if (phase2Missions && phase2Missions.length > 0) {
      phase2Results = (
        <div>
          <p className="dashboard__timeline-point__text">
          <b>Phase II</b> &thinsp;
        </p>
          <MissionResult result={this._getResults(props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
                        records={this._getRecords(props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
                    mission={this.props.mission}
                    missionType={missionConfig.PHASE_II_MISSION_TYPE}
                    isGetResultsInProgress={props.isGetResultsInProgress}/>
        </div>
      )

    } else if (!this.props.isGetMissionsInProgress) {
      phase2Results = (
        <div className="flex-container align-center space-between">
          <p className="dashboard__timeline-point__text">
            <b>Phase II</b> &thinsp;
            No Phase II missions have been launched from this one.
          </p>
        </div>

      )
    }

    return (
      <div className="">
        <div className="row dashboard__title">
          <div className="columns flex-container space-between align-center">
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
      // console.log('leadsToMissions', mission.leadsToMissions)

      records = _.compact(_.flatten(_.map(mission.leadsToMissions, id => this.props.resultsByMission[id])));

      // console.log(records.length, 'records')
      // console.log('records', records)

    } else {
      throw new Error('You must specify for Phase I or Phase II you want to get records')
    }

    return records;
  }

  _getResults(mission, getForMissionType) {
    let records = this._getRecords(mission, getForMissionType);
    let results = parseResults(records, this.props.roster, mission);;

    return results;
  }

}

export default Dashboard
