import React, {Component} from 'react'
import QuestionCard from 'fbw-platform-common/components/question-card/web/QuestionCard'
import StudentLink from '../StudentLink'

import './QuestionResult.scss'

class QuestionResult extends Component {

  constructor() {
    super();
    this.state = {isExpanded: false}
  }

  render() {
    let props = this.props;
    let expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';
    let expandedStudents = !this.state.isExpanded ? null :
          (
            <ul className="students-list">

            </ul>
          )

    // console.log('outcome:', props.outcome);
    // console.log('records', props.records);

    // let everyone = _.

    return (
      <div key={`questionResult_${props.idx}`} className="question-result ">
        <div className="row">
          <div className="medium-12 medium-centered columns">
            <div className="question-statistics">
              <p className="question-statistics__students-list">
                <span className="bold">Incorrect: </span>
                {_.map(props.records, (record, idx) => {
                  // console.log('record', record);

                  return (<StudentLink key={`${idx}`} className="students-list__item"
                                      student={record.user}
                                      onSelectResult={this.props.onSelectMissionResult}/>)
                })}
              </p>
              {/* <p className="question-statistics__students-list">
                <span className="bold">Incorrect: </span>
                {_.map(props.result.notAchieved, studentResult => {
                  return (<StudentLink key={studentResult.takingAgentId} className="students-list__item"
                                      studentResult={studentResult}
                                      onSelectResult={this.props.onSelectMissionResult}/>)                })}
              </p>

              <p className="question-statistics__students-list">
                <span className="bold">Correct: </span>
                {_.map(props.result.achieved, studentResult => {
                  return (<StudentLink key={studentResult.takingAgentId} className="students-list__item"
                                      studentResult={studentResult}
                                      onSelectResult={this.props.onSelectMissionResult}/>)                })}
              </p> */}
            </div>

            {/* <div>
              {_.map(recordsForQuestion, (record, idx) => {
                let user = record.user;
                return (
                  <p key={`user.Identifer-${idx}`}>
                    <span>{getD2LDisplayName(user)}</span>
                    <span> chose {record.responseResult.choice.id}</span>
                  </p>
                )
              })}

              <p>{recordsForQuestion[0].question.text}</p>
            </div> */}

            <QuestionCard question={props.records[0].responseResult.question}
                          outcome={props.outcome}
                          isExpanded={false}
                          isSubmitEnabled={false}/>
          </div>
        </div>


      </div>
    )
  }


}

export default QuestionResult
