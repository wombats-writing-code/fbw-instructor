import React, {Component} from 'react';
import _ from 'lodash'
import pluralize from 'pluralize'
const ProgressBar = require('progressbar.js')
import Spinner from 'react-spinner'

import LoadingBox from '@wombats-writing-code/fbw-platform-common/components/loading-box/web/'
import EmptyState from '@wombats-writing-code/fbw-platform-common/components/empty-state/web/EmptyState'
import OutcomeResult from '../components/OutcomeResult'
import GradesTable from '../components/GradesTable'

import './OutcomesView.scss'

const BAD_COLOR = "#FF6F69";
const MEDIUM_COLOR = "#f8e57d";
const GOOD_COLOR = "#96CEB4";

class OutcomesView extends Component {

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

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.results && prevProps.results !== this.props.results) {
      // console.log('componentDidUpdate in OutcomesView')
      this._drawOutcomes(this.props.results);
    }
  }

  componentDidMount() {
    let results = this.props.results;

    if (results) {
      this._drawOutcomes(results);
    }
  }

  _drawOutcomes(results) {

    if (results) {
      setTimeout( () => {
        // console.log('this.instanceId', this.instanceId)
        let badCircle = new ProgressBar.Circle(`#bad-outcomes_${this.instanceId}`, {
          strokeWidth: 6,
          easing: 'easeInOut',
          duration: 1400,
          color: BAD_COLOR,
          trailColor: '#eee',
          trailWidth: 1,
          svgStyle: null
        });

        let medCircle = new ProgressBar.Circle(`#medium-outcomes_${this.instanceId}`, {
          strokeWidth: 6,
          easing: 'easeInOut',
          duration: 1400,
          color: MEDIUM_COLOR,
          trailColor: '#eee',
          trailWidth: 1,
          svgStyle: null
        });

        let goodCircle = new ProgressBar.Circle(`#good-outcomes_${this.instanceId}`, {
          strokeWidth: 6,
          easing: 'easeInOut',
          duration: 1400,
          color: GOOD_COLOR,
          trailColor: '#eee',
          trailWidth: 1,
          svgStyle: null
        });

        badCircle.animate(Math.min(results.badOutcomes.length / (this.props.currentMission.goals.length * 3), 1));  // Value from 0.0 to 1.0
        medCircle.animate(Math.min(results.mediumOutcomes.length / (this.props.currentMission.goals.length * 3), 1));
        goodCircle.animate(Math.min(results.goodOutcomes.length / (this.props.currentMission.goals.length * 3), 1));

      }, 100);
    }

  }

  render() {
    let props = this.props;
    let results = props.results;
    // console.log('props of OutcomesView isGetResultsInProgress', this.props.isGetResultsInProgress)
    // console.log('currentOutcomeCategory', results[this.state.currentOutcomeCategory])

    if (!results && props.isGetResultsInProgress) {
      return (
        <div className="row ">
          <div className="medium-12 medium-centered columns margin-bottom">
            {LoadingBox('enter-active')}
          </div>
        </div>
      );
    }

    if (!results && !props.isGetResultsInProgress) {
      return (
        <div className="row margin-bottom">
          {EmptyState("No students have opened the mission yet")}
        </div>
      );
    }

    // console.log('badOutcomes', props.badOutcomes)

    let badOutcomesList = _.map(results.badOutcomes, (recordsForOutcome, outcomeId, idx) => {
      let outcome = _.find(props.outcomes, {id: outcomeId});

      return (
        <li className="outcome-result-item" key={`bad-outcome-result-item-${outcomeId}`}>
          <OutcomeResult outcome={outcome} recordsForOutcome={recordsForOutcome} mission={props.mission}
                  onSelectStudentResult={(student) => this.props.onSelectStudentResult(student, props.mission, props.user)}
          />
        </li>
      )
    })

    let mediumOutcomesList = _.map(results.mediumOutcomes, (recordsForOutcome, outcomeId, idx) => {
      let outcome = _.find(props.outcomes, {id: outcomeId});

      return (
        <li className="outcome-result-item" key={`good-outcome-result-item-${outcomeId}`}>
          <OutcomeResult outcome={outcome} recordsForOutcome={recordsForOutcome} mission={props.mission}
                  onSelectStudentResult={(student) => this.props.onSelectStudentResult(student, props.mission, props.user)}
          />
        </li>
      )
    })

    let goodOutcomesList = _.map(results.goodOutcomes, (recordsForOutcome, outcomeId, idx) => {
      let outcome = _.find(props.outcomes, {id: outcomeId});

      return (
        <li className="outcome-result-item" key={`good-outcome-result-item-${outcomeId}`}>
          <OutcomeResult outcome={outcome} recordsForOutcome={recordsForOutcome} mission={props.mission}
                  onSelectStudentResult={(student) => this.props.onSelectStudentResult(student, props.mission, props.user)}
          />
        </li>
      )
    })


    return (
      <div className="mission-result">
          <div className="row">
            <div className="large-4 columns no-left-padding">
              <div id={`bad-outcomes_${this.instanceId}`} className="circle-container ">
                <span className="circle__center-text " style={{color: BAD_COLOR}}>
                  <span className="circle__center-text__number">{_.size(results.badOutcomes)}</span> <br/>
                  outcomes
                </span>
              </div>

              <p className="circle__caption-text bold">
                &gt;50% of students did not achieve
              </p>
              {badOutcomesList}
            </div>

            <div className="large-4 columns">
              <div id={`medium-outcomes_${this.instanceId}`} className="circle-container">
                <span className="circle__center-text " style={{color:  MEDIUM_COLOR}}>
                  <span className="circle__center-text__number">{_.size(results.mediumOutcomes)}</span> <br/>
                  outcomes
                  </span>
              </div>

              <p className="circle__caption-text bold">
                &lt;50% of students did not achieve
              </p>
              {mediumOutcomesList}
            </div>

            <div className="large-4 columns no-right-padding">
              <div id={`good-outcomes_${this.instanceId}`} className="circle-container"
                    >
                <span className="circle__center-text " style={{color: GOOD_COLOR}}>
                  <span className="circle__center-text__number">{_.size(results.goodOutcomes)}</span> <br/>
                  outcomes
                </span>
              </div>

              <p className="circle__caption-text bold">
                &lt;25% of students did not achieve
              </p>
              {goodOutcomesList}
            </div>
          </div>

        </div>
    )
  }



}

export default OutcomesView
