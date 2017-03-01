import React, {Component} from 'react';
import _ from 'lodash'

import EmptyState from 'fbw-platform-common/components/empty-state/web/EmptyState'
import QuestionResult from '../components/QuestionResult'
import GradesTable from './GradesTable'

import './ResultsView.scss'

class ResultsView extends Component {

  constructor() {
    super();

    this.state = {
      isQuestionsExpanded: false,
    }
  }

  render() {
    let props = this.props;
    let results = props.results;
    // console.log('props of ResultsView', this.props)

    if (!results) {
      return (
        <GradesTable grades={props.grades} />
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
                <QuestionResult records={recordsForQuestion} outcome={outcome} />
              </li>
            )
          })}
        </ol>
      )
    }

    let resultsOutcomes;
    if (this.state.isOutcomesExpanded) {
      resultsOutcomes = (
        <ol className="">

        </ol>
      )
    }

    let refreshPrompt;
    if (!props.results) {
      refreshPrompt = <p className="prompt">Click on the mission again to refresh results.</p>
    }

    return (
      <div className="results-view">
        <GradesTable grades={props.grades} />

        {refreshPrompt}

        <div className="results__section">
          <div className="flex-container space-between align-center">
            <p className="results__subtitle">Questions most missed</p>
            <button className="expand-collapse-button"
                    onClick={(e) => this.setState({isQuestionsExpanded: !this.state.isQuestionsExpanded})}>
              {this.state.isQuestionsExpanded ? 'Hide' : 'Show'}
            </button>
          </div>

          {resultsQuestions}
        </div>

        <div className="results__section">
          <div className="flex-container space-between align-center">
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


}

export default ResultsView
