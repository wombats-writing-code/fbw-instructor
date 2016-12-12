import React from 'react'

import './QuestionResult.scss'

const createMarkup = (htmlString) => {
  return {__html: htmlString};
}

const renderMath = (element) => {
  MathJax.Hub.Typeset();
  // katex.render(texString, element);
}

export const QuestionResult = (datum, idx) => {

  return (
    <div key={`questionResult_${idx}`} className="question-result flex-container align-top">
      <div className="question-statistics">
        <p className="">{datum.numStudentsAttempted} <span className="mute light">students tried</span></p>
        <p className="warning-color">{datum.numStudentsNotAchieved} <span className="mute light">got wrong </span></p>
      </div>
      <div className="question__body" dangerouslySetInnerHTML={createMarkup(datum.questionText)}
            ref={(el) => renderMath(el)}
      ></div>
    </div>
  )
}

export default QuestionResult
