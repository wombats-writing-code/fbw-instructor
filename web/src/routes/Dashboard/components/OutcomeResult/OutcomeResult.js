import React, {Component} from 'react'
import pluralize from 'pluralize'

import QuestionResult from '../QuestionResult'

import './OutcomeResult.scss'

class OutcomeResult extends Component {

  constructor() {
    super();
    this.state = {
      isExpanded: false
    }
  }

  render() {
    let props = this.props;
    let recordsForOutcome = props.recordsForOutcome;

    let uniqueQuestions = _.uniqBy(recordsForOutcome, 'question.id');
    let recordsByQuestion = _.groupBy(recordsForOutcome, 'question.id');

    // console.log('uniqueQuestions for', props.outcome.displayName, _.map(uniqueQuestions, 'question.text'))

    let questionsForOutcome;
    if (this.state.isExpanded) {
      questionsForOutcome = _.map(recordsByQuestion, (records, qId) => {
        return (
          <div key={`outcome__question--${qId}`} className="no-style">
            <QuestionResult records={records} outcome={props.outcome} mission={props.mission}
                            onSelectStudent={props.onSelectStudent} />
          </div>
        )
      })
    }

    return (
      <div className="outcome-result">
        <p>
          <span className="outcome-result__outcome-name">{props.outcome.displayName}</span>
          <span className="outcome-result__number-questions" onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
            {this.state.isExpanded ? 'Hide ' : 'Show '}
            {uniqueQuestions.length} {pluralize('question', uniqueQuestions.length)}
          </span>
        </p>

        {questionsForOutcome}
      </div>
    )
  }

}

export default OutcomeResult
