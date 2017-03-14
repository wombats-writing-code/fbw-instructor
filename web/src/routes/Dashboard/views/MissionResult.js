import React, {Component} from 'react';
import _ from 'lodash'
import pluralize from 'pluralize'
const ProgressBar = require('progressbar.js')

import EmptyState from 'fbw-platform-common/components/empty-state/web/EmptyState'
import OutcomeResult from './OutcomeResult'
import GradesTable from './GradesTable'

import './MissionResult.scss'

const BAD_COLOR = "#FF6F69";
const MEDIUM_COLOR = "#fce77f";
const GOOD_COLOR = "#96CEB4";

class MissionResult extends Component {

  constructor() {
    super();

    this.instanceId = _.uniqueId();

    this.state = {
      currentOutcomeCategory: 'badOutcomes',
      isOutcomesExpanded: {
        'badOutcomes': true,
        'mediumOutcomes': false,
        'goodOutcomes': false,
      },
    }
  }

  componentDidMount() {
    let results = this.props.results;

    let badCircle = new ProgressBar.Circle(`#bad-outcomes_${this.instanceId}`, {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1400,
      color: BAD_COLOR,
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });

    badCircle.animate(Math.min(results.badOutcomes.length / (this.props.currentMission.goals.length * 3), 1));  // Value from 0.0 to 1.0

    let medCircle = new ProgressBar.Circle(`#medium-outcomes_${this.instanceId}`, {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1400,
      color: MEDIUM_COLOR,
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });

    medCircle.animate(Math.min(results.mediumOutcomes.length / (this.props.currentMission.goals.length * 3), 1));

    let goodCircle = new ProgressBar.Circle(`#good-outcomes_${this.instanceId}`, {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1400,
      color: GOOD_COLOR,
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });

    goodCircle.animate(Math.min(results.goodOutcomes.length / (this.props.currentMission.goals.length * 3), 1));
  }

  render() {
    let props = this.props;
    let results = props.results;
    // console.log('props of MissionResult', this.props)
    // console.log('currentOutcomeCategory', results[this.state.currentOutcomeCategory])

    let badOutcomesList = _.map(results.badOutcomes, (recordsForOutcome, idx) => {
      return (
        <li className="outcome-result-item" key={`bad-outcome-result-item-${idx}`}>
          <OutcomeResult outcomes={props.outcomes} recordsForOutcome={recordsForOutcome} mission={props.mission}
                  onSelectStudentResult={(student) => this.props.onSelectStudentResult(student, props.mission, props.user)}
          />
        </li>
      )
    })

    let mediumOutcomesList = _.map(results.mediumOutcomes, (recordsForOutcome, idx) => {
      return (
        <li className="outcome-result-item" key={`good-outcome-result-item-${idx}`}>
          <OutcomeResult outcomes={props.outcomes} recordsForOutcome={recordsForOutcome} mission={props.mission}
                  onSelectStudentResult={(student) => this.props.onSelectStudentResult(student, props.mission, props.user)}
          />
        </li>
      )
    })

    let goodOutcomesList = _.map(results.goodOutcomes, (recordsForOutcome, idx) => {
      return (
        <li className="outcome-result-item" key={`good-outcome-result-item-${idx}`}>
          <OutcomeResult outcomes={props.outcomes} recordsForOutcome={recordsForOutcome} mission={props.mission}
                  onSelectStudentResult={(student) => this.props.onSelectStudentResult(student, props.mission, props.user)}
          />
        </li>
      )
    })


    return (
      <div className="mission-result">
        <div className="results__section">
          <div className="flex-container justify-center align-center">
            <p className="results__subtitle">Outcomes</p>
            <p className="results__subtitle">Grades</p>
          </div>

          <div className="row">
            <div className="medium-4 columns no-left-padding">
              <div id={`bad-outcomes_${this.instanceId}`} className="circle-container "
                  onClick={() => this._onClickOutcomeCategory('badOutcomes')}>
                <span className="circle__center-text " style={{color: BAD_COLOR}}>
                  {results.badOutcomes.length} <br/>
                </span>
              </div>

              <p className="circle__caption-text bold">
                {results.badOutcomes.length} outcomes
              </p>
              {badOutcomesList}
            </div>

            <div className="medium-4 columns">
              <div id={`medium-outcomes_${this.instanceId}`} className="circle-container"
                    onClick={() => this._onClickOutcomeCategory('mediumOutcomes')}>
                <span className="circle__center-text " style={{color:  MEDIUM_COLOR}}>{results.mediumOutcomes.length}</span>
              </div>

              <p className="circle__caption-text bold">
                {results.mediumOutcomes.length} outcomes
              </p>
              {mediumOutcomesList}
            </div>

            <div className="medium-4 columns no-right-padding">
              <div id={`good-outcomes_${this.instanceId}`} className="circle-container"
                    onClick={() => this._onClickOutcomeCategory('goodOutcomes')}>
                <span className="circle__center-text " style={{color: GOOD_COLOR}}>{results.goodOutcomes.length}</span>
              </div>

              <p className="circle__caption-text bold">
                {results.goodOutcomes.length} outcomes
              </p>
              {goodOutcomesList}
            </div>
          </div>

        </div>

        {/* <div className="results__section">
          <p className="results__subtitle">Grades</p>
          <GradesTable grades={props.grades}
                      mission={props.currentMission}
                      onSelectStudent={(student) => this.props.onSelectStudentResult(student, props.currentMission, props.user)}/>
        </div> */}
      </div>

    )
  }

  _onClickOutcomeCategory = (category) => {
    this.setState({
      isOutcomesExpanded: {
        [category]: true
      },
      currentOutcomeCategory: category
    });
    // console.log('state for ', outcome.id, this.state.isOutcomeQuestionsExpanded[outcome.id])
  }


}

export default MissionResult
