import React, {Component} from 'react'
import moment from 'moment'
import $ from 'jquery'
import {missionConfig} from '@wombats-writing-code/fbw-platform-common/reducers/Mission'
import ResultsView from './containers/ResultsViewContainer'
import LoadingBox from '@wombats-writing-code/fbw-platform-common/components/loading-box/web/'
import {parseResults} from './selectors/resultsSelector'
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

      console.log('phaseIIPositionStyle', phase2Results.top);
    }, 300);
  }

  render() {
    let props = this.props;

    if (!props.mission) return null;

    let loadingBox;
    if (this.props.isGetResultsInProgress) {
      loadingBox = LoadingBox('enter-active')
    } else {
      loadingBox = LoadingBox('enter')
    }


    let resultsView, recommendationView;
    if (props.mission && !this.props.isGetResultsInProgress && !this.props.isGetMissionsInProgress) {
      resultsView = (
          <ResultsView results={this._getResults(props.mission)}
                      records={this._getRecords(props.mission)}
                        mission={props.mission}
                        isGetResultsInProgress={props.isGetResultsInProgress}
                      />
        )
    }

    let phase2Missions = _.map(props.mission.leadsToMissions, id => _.find(props.missions, {id: id}));
    // console.log('phaseIIMissions', phase2Missions)

    let phase2Results;
    let phase2TimelineText;
    if (phase2Missions && phase2Missions.length > 0) {
      phase2Results = (
          <ResultsView results={this._getResults(this.props.mission, missionConfig.PHASE_II_MISSION_TYPE)}
                    mission={this.props.mission}
                    isGetResultsInProgress={props.isGetResultsInProgress}/>
      )

      phase2TimelineText = (
        <span className="dashboard__timeline-point__text">
          <span>Phase II</span> &thinsp;
          <span className=" ">
            {moment(this._getLeadsToMission(props.mission).startTime).format('ddd, MMM D [at] ha')}
              &mdash;
            {moment(this._getLeadsToMission(props.mission).deadline).format('ddd, MMM D [at] ha')}
          </span>
        </span>
      )

    } else if (!this.props.isGetMissionsInProgress) {
      phase2TimelineText = (
      <p className="dashboard__timeline-point__text">
        <span>Phase II</span> &thinsp;
        No Phase II missions have been launched from this one.
      </p>)
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


        <div className="row dashboard__body-wrapper">
          <div className="dashboard__timeline">
            <div className="dashboard__timeline-line"></div>
            <div className="dashboard__timeline-point">
              <span className="dashboard__timeline-point__text">
                <span>Phase I</span> &thinsp;
                {moment(props.mission.startTime).format('ddd, MMM D [at] ha')}
                &mdash;
                {moment(props.mission.deadline).format('ddd, MMM D [at] ha')}
              </span>
            </div>

            <div className="dashboard__timeline-point end" style={this.state.phaseIIPositionStyle}>
              {phase2TimelineText}
            </div>
          </div>

          <div className="dashboard__body medium-11 columns">
            <div className="row">
              {resultsView}
            </div>

            <div className="row" id="phase2Results">
              {phase2Results}
            </div>
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
