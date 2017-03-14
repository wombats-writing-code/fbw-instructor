import React, {Component} from 'react'
import pluralize from 'pluralize'

import QuestionResult from '../components/QuestionResult'

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

    let outcome = _.find(props.outcomes, {id: recordsForOutcome[0].outcome});
    let uniqueQuestions = _.uniqBy(recordsForOutcome, 'question.id');
    let recordsByQuestion = _.groupBy(recordsForOutcome, 'question.id');

    let questionsForOutcome;
    if (this.state.isExpanded) {
      questionsForOutcome = _.map(recordsByQuestion, (records, qId) => {
        return (
          <div key={`outcome__question--${qId}`} className="no-style">
            <QuestionResult records={records} outcome={outcome} mission={props.mission}
                            onSelectResult={props.onSelectStudentResult} />
          </div>
        )
      })
    }

    return (
      <div className="outcome-result">
        <p>
          {outcome.displayName}
          <span className="number-questions" onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
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
