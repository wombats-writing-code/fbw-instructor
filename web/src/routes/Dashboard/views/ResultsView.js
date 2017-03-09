import React, {Component} from 'react';
import _ from 'lodash'
import pluralize from 'pluralize'

import EmptyState from 'fbw-platform-common/components/empty-state/web/EmptyState'
import QuestionResult from '../components/QuestionResult'
import GradesTable from './GradesTable'

import './ResultsView.scss'

class ResultsView extends Component {

  constructor() {
    super();

    this.state = {
      isQuestionsExpanded: false,
      isOutcomesExpanded: true,
      isOutcomeQuestionsExpanded: {}
    }
  }

  render() {
    let props = this.props;
    let results = props.results;
    // console.log('props of ResultsView', this.props)

    if (!results) {
      return (
        <GradesTable grades={props.grades}
                    mission={props.currentMission}
                    onSelectStudent={(student) => this.props.onSelectStudentResult(student, props.currentMission, props.user)}/>
      );
    }

    let resultsQuestions;
    if (this.state.isQuestionsExpanded) {
      resultsQuestions = (
        <ol className="results__questions-list">
          {_.map(results.incorrectQuestionsRanked, (recordsForQuestion) => {
            // console.log(recordsForQuestion[0].question.id)
            let outcome = _.find(this.props.outcomes, {id: recordsForQuestion[0].outcome});

            return (
              <li key={`incorrect-question-${recordsForQuestion[0].question.id}`}>
                <QuestionResult records={recordsForQuestion} outcome={outcome}
                                mission={props.currentMission}
                                onSelectResult={this.props.onSelectStudentResult}/>
              </li>
            )
          })}
        </ol>
      )
    }

    let resultsOutcomes;
    if (this.state.isOutcomesExpanded) {
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
        <GradesTable grades={props.grades}
                    mission={props.currentMission}
                    onSelectStudent={(student) => this.props.onSelectStudentResult(student, props.currentMission, props.user)}/>

        <div className="results__section">
          <div className="flex-container align-center">
            <p className="results__subtitle">Questions most missed</p>
            <button className="expand-collapse-button"
                    onClick={(e) => this.setState({isQuestionsExpanded: !this.state.isQuestionsExpanded})}>
              {this.state.isQuestionsExpanded ? 'Hide' : 'Show'}
            </button>
          </div>

          {resultsQuestions}
        </div>

        <div className="results__section">
          <div className="flex-container align-center">
            <p className="results__subtitle">Outcomes most missed</p>
            <button className="expand-collapse-button"
                    onClick={(e) => this.setState({isOutcomesExpanded: !this.state.isOutcomesExpanded})}>
              {this.state.isOutcomesExpanded ? 'Hide' : 'Show'}
            </button>
          </div>

          {resultsOutcomes}
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
