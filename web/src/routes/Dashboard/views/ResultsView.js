import React, {Component} from 'react';
import _ from 'lodash'
import pluralize from 'pluralize'
const ProgressBar = require('progressbar.js')

import EmptyState from 'fbw-platform-common/components/empty-state/web/EmptyState'
import QuestionResult from '../components/QuestionResult'
import GradesTable from './GradesTable'

import './ResultsView.scss'

const BAD_COLOR = "#FF6F69";
const MEDIUM_COLOR = "#FFEA82";
const GOOD_COLOR = "#96CEB4";

class ResultsView extends Component {

  constructor() {
    super();

    this.state = {
      isQuestionsExpanded: false,
      isOutcomesExpanded: true,
      isOutcomeQuestionsExpanded: {}
    }
  }

  componentDidMount() {
    let results = this.props.results;

    let badCircle = new ProgressBar.Circle('#bad-outcomes', {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1400,
      color: BAD_COLOR,
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });

    badCircle.animate(results.badOutcomes.length / this.props.currentMission.goals.length);  // Value from 0.0 to 1.0

    let medCircle = new ProgressBar.Circle('#medium-outcomes', {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1400,
      color: MEDIUM_COLOR,
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });

    medCircle.animate(results.mediumOutcomes.length / this.props.currentMission.goals.length);  // Value from 0.0 to 1.0

    let goodCircle = new ProgressBar.Circle('#good-outcomes', {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1400,
      color: GOOD_COLOR,
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null
    });

    goodCircle.animate(results.goodOutcomes.length / this.props.currentMission.goals.length);  // Value from 0.0 to 1.0
  }

  render() {
    let props = this.props;
    let results = props.results;
    // console.log('props of ResultsView', this.props)

    let resultsOutcomes;
    if (results && this.state.isOutcomesExpanded) {
      resultsOutcomes = (
        <ol className="results__outcomes-list">
          {_.map(results.incorrectOutcomesRanked, (recordsForOutcome, idx) => {
            // console.log(recordsForOutcome[0])
            let outcome = _.find(this.props.outcomes, {id: recordsForOutcome[0].outcome});
            let uniqueQuestions = _.uniqBy(recordsForOutcome, 'question.id');

            let recordsByQuestion = _.groupBy(recordsForOutcome, 'question.id');

            let questionsForOutcome;
            if (this.state.isOutcomeQuestionsExpanded[outcome.id]) {
              questionsForOutcome = _.map(recordsByQuestion, (records, qId) => {
                return (
                  <div key={`outcome__question--${qId}`} className="no-style">
                    <QuestionResult records={records} outcome={outcome} mission={props.mission}
                                    onSelectResult={(student) => this.props.onSelectStudentResult(student, props.mission, props.user)} />
                  </div>
                )
              })
            }

            return (
              <li key={`incorrect-outcome-${outcome.id}`}>
                <p>
                  {outcome.displayName}
                  <button className="number-questions" onClick={() => this._toggleOutcomeQuestions(outcome)}>
                    {this.state.isOutcomeQuestionsExpanded[outcome.id] ? 'Hide ' : 'Show '}
                    {uniqueQuestions.length} {pluralize('question', uniqueQuestions.length)}
                  </button>
                </p>

                {questionsForOutcome}
              </li>
            )
          })}
        </ol>
      )
    }

    return (
      <div className="results-view">
        <div className="results__section">
          <div className="flex-container align-center">
            <p className="results__subtitle">Outcomes</p>
          </div>

          <div className="flex-container align-center space-between">
            <div id="bad-outcomes" className="circle-container">
              <span className="circle__text number" style={{color: BAD_COLOR}}>
                {results.badOutcomes.length} <br/>
              </span>
              {/* <span className="circle__text">outcomes</span> */}
            </div>
            <div id="medium-outcomes" className="circle-container">
              <span className="circle__text number" style={{color:  MEDIUM_COLOR}}>{results.mediumOutcomes.length}</span>
            </div>
            <div id="good-outcomes" className="circle-container">
              <span className="circle__text number" style={{color: GOOD_COLOR}}>{results.goodOutcomes.length}</span>
            </div>
          </div>

          {resultsOutcomes}
        </div>

        <div className="results__section">
          <p className="results__subtitle">Grades</p>
          <GradesTable grades={props.grades}
                      mission={props.currentMission}
                      onSelectStudent={(student) => this.props.onSelectStudentResult(student, props.currentMission, props.user)}/>
        </div>
      </div>

    )
  }

  _toggleOutcomeQuestions = (outcome) => {
    this.setState({
      isOutcomeQuestionsExpanded: _.assign({}, this.state.isOutcomeQuestionsExpanded, {
        [outcome.id]: !this.state.isOutcomeQuestionsExpanded[outcome.id]
      })
    })

    // console.log('state for ', outcome.id, this.state.isOutcomeQuestionsExpanded[outcome.id])
  }
}

export default ResultsView
