import React from 'react'
import BASE_STYLES from '../../styles/baseStyles'

import '../../styles/animations.scss'

let styles = {
  resultItem: {
    display: 'flex',
    fontSize: '.875rem',
  },
  questionText: {
    textAlign: 'left',
    overflow: 'hidden',
    marginBottom: '1.625rem',
    width: '75%',
    flex: 5
  },
  warning: {
    color: BASE_STYLES.warningColor,
    fontWeight: '500'
  },
  muted: {
    color: '#888'
  },
  resultInfoTotal: {
    color: '#555',
    fontWeight: '500'
  },
  resultInfo: {
    textAlign: 'left',
    marginRight: '1em',
    flex: 1
  }
}


const createMarkup = (htmlString) => {
  return {__html: htmlString};
}

const renderMath = (element) => {
  MathJax.Hub.Typeset();
  // katex.render(texString, element);
}

export const QuestionResult = (datum, idx) => {

  return (
    <div key={`questionResult_${idx}`} style={[styles.resultItem]}>
      <div style={styles.resultInfo}>
        <span style={styles.warning}>{datum.numStudentsNotAchieved} </span>
        <span style={styles.muted}>of </span>
        <span style={styles.resultInfoTotal}>{datum.numStudentsAttempted}</span>
      </div>
      <div style={styles.questionText} dangerouslySetInnerHTML={createMarkup(datum.questionText)}
            ref={(el) => renderMath(el)}
      ></div>
    </div>
  )
}

export default QuestionResult
