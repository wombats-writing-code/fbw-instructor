import React, {Component} from 'react'
import QuestionCard from 'fbw-platform-common/components/question-card/web/QuestionCard'
import StudentLink from '../StudentLink'

// import {getChoiceAlphabet} from 'fbw-platform-common/'

import './QuestionResult.scss'

class QuestionResult extends Component {

  constructor() {
    super();
    this.state = {isExpanded: false}
  }

  render() {
    let props = this.props;
    let expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';

    // console.log('QuestionResult props', props)
    // console.log('outcome:', props.outcome);
    // console.log('records', props.records);

    let responseResult = _.find(props.records, 'responseResult').responseResult;
    let question = responseResult.question;

    // we artificially make a new 'question response object' by injecting the question with a correct response
    // because instructors want to see the correct response to a question
    let questionWithCorrectResponse = _.assign({}, question, {
      response: {
        choice: _.find(question.choices, {choiceId: question.solution.choiceId}),
        isCorrect: true
      }
    });

    return (
      <div key={`questionResult_${props.idx}`} className="question-result ">
        <div className="row">
          <div className="medium-12 medium-centered columns">
            <div className="question-statistics">
              <ul className="question-statistics__students-list">
                <span className="bold">Incorrect: </span>
                {_.map(props.records, (record, idx) => {
                  let studentChoice = record.responseResult.choice;

                  return (
                    <div key={`student-link-${idx}`} className="students-list__item">
                      <StudentLink student={record.user} mission={props.mission} onSelectResult={this.props.onSelectResult}/>
                      <span className="student__choice-response">&#8201;
                        ({getChoiceAlphabet(studentChoice, question.choices)})
                      </span>
                    </div>
                    )
                })}
              </ul>

              <QuestionCard question={questionWithCorrectResponse}
                          outcome={props.outcome}
                          isExpanded={false}
                          isSubmitEnabled={false}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function getChoiceAlphabet(choice, choices) {
  const Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  let idx = _.findIndex(choices, {choiceId: choice.choiceId});
  return Alphabet[idx];
}

export default QuestionResult
