import React, {Component} from 'react'

// TODO: Cole
// import {qbankAgentToDisplayName} from 'fbw-platform-common/...blah blah'

import './QuestionResult.scss'

const createMarkup = (htmlString) => {
  return {__html: htmlString};
}

const renderMath = (element) => {
  MathJax.Hub.Typeset();
  // katex.render(texString, element);
}

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
              {_.map(props.studentsAchieved, student => {
                return (<p key={student.takingAgentId}>{student.takingAgentId}</p>)
              })}
              {_.map(props.studentsNotAchieved, student => {
                return (<p key={student.takingAgentId} className="warning-color">{student.takingAgentId}</p>)
              })}
            </ul>
          )

    return (
      <div key={`questionResult_${props.idx}`} className="question-result flex-container align-top">
        <div className="question-statistics">
          <div className="flex-container align-center space-between">
            <div>
              <p className="">{props.result.numStudentsAttempted} <span className="mute light">students tried</span></p>
              <p className="warning-color">{props.result.numStudentsNotAchieved} <span className="mute light">got wrong </span></p>
            </div>
            <button className="expand-collapse-button small"
                    onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>{expandCollapseButtonText}</button>
          </div>

          {expandedStudents}
        </div>

        <div className="question__body" dangerouslySetInnerHTML={createMarkup(props.result.questionText)}
              ref={(el) => renderMath(el)}
        ></div>
      </div>
    )
  }

}

export default QuestionResult
