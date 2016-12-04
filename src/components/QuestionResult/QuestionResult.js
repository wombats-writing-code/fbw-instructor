import React from 'react'
import BASE_STYLES from '../../styles/baseStyles'

import '../../styles/animations.scss'
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
    <div key={`questionResult_${idx}`} className="">
      <div className="question-statistics">
        <span className="warning-color">{datum.numStudentsNotAchieved} wrong </span>
        <span className="mute">of </span>
        <span className="">{datum.numStudentsAttempted} students</span>
      </div>
      <div className="question__body" dangerouslySetInnerHTML={createMarkup(datum.questionText)}
            ref={(el) => renderMath(el)}
      ></div>
    </div>
  )
}

export default QuestionResult
