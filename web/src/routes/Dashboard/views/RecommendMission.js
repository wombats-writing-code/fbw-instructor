import React, {Component} from 'react';
import _ from 'lodash'
import {Link} from 'react-router'
import moment from 'moment'

import { DateRangePicker } from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'

// import {osidToDisplayName} from 'fbw-platform-common/selectors/login'

// require('./datepicker.css')
import './RecommendMission.scss'

const _getPlurality = (number) => {
  if (number === 1) return '';

  return 's';
}

class RecommendMissionView extends Component {

  constructor() {
    super();
    this.state = {
      focused: null,
      isExpanded: false
    };
  }

  render() {
    let props = this.props;

    console.log('props of recommend mission', props);
    if (!props.recommendation) {
      return null;
    }

    let spawnStatus, spawnVerb;
    if (props.mission.hasSpawnedFollowOnPhase || props.spawnedMissions) {
      spawnStatus = (
        <p >
          Testflight missions have been created. Every student has received a personalized mission targeting the directives they missed:
        </p>
      )
      spawnVerb = 'received';

    } else if (!props.isSpawnInProgress && !props.spawnedMissions) {
      spawnStatus = <p>
        Your Fly-by-Wire system recommends to give personalized Testflight missions:
      </p>
      spawnVerb = 'will get';
    }

    let studentCollection, phaseIIDatePicker;
    if (this.state.isExpanded) {
      studentCollection = (
        <ul className="student-recommendation-list">
          {_.map(props.recommendation.students, (student, idx) => {
            return (
              <li key={`student_${idx}`}>
                <p>
                  {/* <Link key={`studentName__${idx}`} className="link">{student.displayName}</Link> */}
                  <span>{student.displayName}</span>
                  <span> {spawnVerb} </span>
                  <span>{student.nextMission.directives.length} </span>
                  <span>directive{_getPlurality(student.nextMission.directives.length)} with a total of </span>
                  <span>{student.nextMission.numberItemsForDirectives} </span>
                  question{_getPlurality(student.nextMission.numberItemsForDirectives)}.</p>
              </li>
            )
          })}
        </ul>
      )

      phaseIIDatePicker = (<div className="form-section clearfix">
         <label className="form-label">Dates</label>
         <DateRangePicker className=""
                          focusedInput={this.state.focused}
                          onFocusChange={(focused) => this.setState({focused})}
                          onDatesChange={(dateData) => props.onSpawnDateChange(dateData)}
                          startDate={props.spawnDate.startTime}
                          endDate={props.spawnDate.deadline} />
       </div>)
    }

    let spawnButtonText;
    if (this.props.isSpawnInProgress) {
      spawnButtonText = 'Working...';
    } else if (this.props.hasSpawnedFollowOnPhase) {
      spawnButtonText = 'Missions launched';
    } else {
      spawnButtonText = 'Launch Phase II Missions!';
    }

    let expandCollapseButtonText;
    if (props.mission) {
      expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';
    } else {
      expandCollapseButtonText = 'No results yet';
    }

    let now = moment.utc();
    let recommendationBar = (
      <div className="summary-bar flex-container align-center">
        <p className="summary__mission-name">
          Recommendation
          <span className="summary__mission-name-type">Launch Phase II mission</span>
        </p>

        <div className="summary-blurb flex-container align-center">
          <p className="summary__number">{props.recommendation ? props.recommendation.students.length : 0}</p>
          <p className="summary__text">to get Phase II</p>
        </div>

        <button className="button spawn-button small"
                disabled={props.isSpawnInProgress}
                onClick={() => this.props.onSpawnPhaseIIMissions(this.props.recommendation.students,
                  this.props.currentBank.id,
                  this.props.mission,
                  this.props.spawnDate || now)}>
          {spawnButtonText}
        </button>

        <button className="expand-collapse-button" disabled={!props.mission}
                onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
          {expandCollapseButtonText}
        </button>

      </div>
    )

    // console.log('focused', this.state.focused)

    return (
      <div className="">
        {recommendationBar}

        {phaseIIDatePicker}
        {studentCollection}

        {/* {spawnStatus}
        {spawnDate}
        {spawnButton}
        {loadingBox} */}
      </div>
    )
  }

}

export default RecommendMissionView
