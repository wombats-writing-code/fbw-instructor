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

    let didRespond = _.find(props.records, 'responseResult');

    // if there is no response (no student hasn't responded yet), we artificially create a responseResult
    // so that we can display the question
    let withResponse = _.find(props.records, 'responseResult');
    if (!didRespond) {
      // console.log('no response records', props.records);
      withResponse = {
        responseResult: {
          question: props.records[0].question
        }
      }
      // console.log('withResponse', withResponse);
    }

    let responseResult = withResponse.responseResult;
    let question = responseResult.question;

    // ============
    // we artificially make a new 'question response object' by injecting the question with a correct response
    // because instructors want to see the correct response to a question

    // if there is no solution attached with the question (because it hasn't been responded to),
    // do this HACK: find the choice with displayName = 0
    // =============
    let solutionChoiceId = didRespond ? question.solution.choiceId : _.find(question.choices, c => c.displayName === 'Choice 0').choiceId;
    let questionWithCorrectResponse = _.assign({}, question, {
      response: {
        choice: _.find(question.choices, {choiceId: solutionChoiceId}),
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
                  // console.log('record', record)
                  let studentChoice = record.responseResult ? record.responseResult.choice : null;

                  return (
                    <div key={`student-link-${idx}`} className="students-list__item">
                      <StudentLink student={record.user} mission={props.mission} onSelectResult={this.props.onSelectStudent}/>
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
                          isExpandable={true}
                          isSubmitEnabled={false}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function getChoiceAlphabet(choice, choices) {
  if (!choice) return 'not responded';

  const Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  let idx = _.findIndex(choices, {choiceId: choice.choiceId});
  return Alphabet[idx];
}

export default QuestionResult
