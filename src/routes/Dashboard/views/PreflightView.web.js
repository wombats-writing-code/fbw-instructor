import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'

let styles = {
  container: {
    display: 'flex'
  },
  directiveCollection: {
    marginLeft: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    borderLeftStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    borderRightStyle: 'solid',
    minWidth: '25%',
    flex: 1,
    flexGrow: 0
  },
  questionCollection: {
    marginLeft: 0,
    paddingLeft: '1em',
    flex: 3
  },
  directiveItem: {
    paddingTop: '.725rem',
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingBottom: '.9rem',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#f8f8f8'
    }
  },
  directiveItemSelected: {
    backgroundColor: '#f8f8f8',
    cursor: 'default'
  },
  directiveItemLast: {
    borderBottomColor: 'transparent',
  },
  directiveText: {
    color: '#333',
    fontSize: '.875rem',
    lineHeight: 1.25,
    marginBottom: 0,
    textAlign: 'left'
  },
  resultItem: {
    display: 'flex',
  },
  questionText: {
    textAlign: 'left',
    overflow: 'hidden',
    marginBottom: '1.625rem',
    fontSize: '.875rem',
    width: '75%',
    flex: 4
  },
  warning: {
    color: BASE_STYLES.warningColor,
    fontWeight: '500'
  },
  muted: {
    color: '#888'
  },
  resultInfoTotal: {
    color: '#666',
    fontWeight: '500'
  },
  resultInfo: {
    marginLeft: '1em',
    fontSize: '1.25rem',
    flex: 1
  }
}


const createMarkup = (htmlString) => {
  return {__html: htmlString};
}

export const PreflightViewWeb = (props) => {

  let view = props.view;
  let viewData = props.viewData;

  if (!view) {
    return (
      <div className="columns">
        { EmptyState('There are no results yet. Try refreshing or waiting for a student to try a question.')}
      </div>
    )
  }

  let currentDirectiveId = view.currentDirective ? view.currentDirective.id : null;
  let questionCollection;
  if (currentDirectiveId) {
    let collection = viewData.resultsByDirective[currentDirectiveId];
    // console.log('currentDirectiveId', currentDirectiveId, 'resultsByDirective', viewData.resultsByDirective, 'resultsByDirective', collection);

    questionCollection = (
      <ul style={styles.questionCollection}>
        {_.map(collection, (result, idx) => {
            return (
              <div key={`question_${idx}`} style={[styles.resultItem]}>
                <div style={styles.questionText} dangerouslySetInnerHTML={createMarkup(result.questionText)}></div>
                <div style={styles.resultInfo}>
                  <span style={styles.warning}>{result.numStudentsNotAchieved}</span> &nbsp;
                  <span style={styles.muted}>of</span> &nbsp;
                  <span style={styles.resultInfoTotal}>{result.numStudentsAttempted}</span>
                </div>
              </div>
            )
        })}
      </ul>
    )
  }


  return (
    <div style={styles.container}>
      <ul style={styles.directiveCollection} className="clearfix">
        {_.map(viewData.directives, (outcome, idx) => {
            let lastItemStyle = idx === viewData.directives.length-1 ? styles.directiveItemLast : null
            return (
              <div key={`outcome_${idx}`}
                  style={[styles.directiveItem, view.currentDirective === outcome ? styles.directiveItemSelected : null, lastItemStyle]}
                  onClick={(e) => props.onClickDirective(outcome, 'dashboard.questionsView')}>
                <p style={styles.directiveText}>{outcome.displayName.text}</p>
              </div>
            )
        })}
      </ul>

      {questionCollection}

    </div>

  )

}
