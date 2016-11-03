import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../../../components/QuestionResult'

let styles = {
  container: {
    display: 'flex'
  },
  directiveSection: {
    minWidth: '25%',
    flex: 1,
    flexGrow: 0
  },
  label: {
    textAlign: 'left',
    fontSize: '.775rem',
    fontWeight: "700",
    color: '#555'
  },
  directiveCollection: {
    marginLeft: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    borderLeftStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    borderRightStyle: 'solid',
  },
  questionSection: {
    paddingLeft: '1em',
    flex: 3
  },
  questionCollection: {
    marginLeft: 0,
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
  }
}

export const TestflightViewWeb = (props) => {

  let view = props.view;
  let viewData = props.viewData;

  // if the view is not loading AND there are no results, show empty state
  // always return this because we just ran out of time
  if (true || !props.isGetResultsInProgress && (!view || !viewData)) {
    return (null
      // <div className="columns">
      //   {EmptyState('There are no results yet. Try refreshing or waiting for a student to try a question.')}
      // </div>
    )

  // if the view is loading or there is no results, show nothing
  } else if (props.isGetResultsInProgress || !view || !viewData) {
    return null;
  }

  let currentDirectiveId = view.currentDirective ? view.currentDirective.id : null;
  let questionCollection;
  if (currentDirectiveId) {
    let collection = viewData.resultsByDirective[currentDirectiveId];
    // console.log('currentDirectiveId', currentDirectiveId, 'resultsByDirective', viewData.resultsByDirective, 'resultsByDirective', collection);

    questionCollection = (
      <ul style={styles.questionCollection}>
        {_.map(collection.questions, (result, idx) => QuestionResult(result, idx))}
      </ul>
    )
  }


  return (
    <div style={styles.container}>

      <div style={styles.directiveSection}>
        <p style={styles.label}>DIRECTIVES</p>
        <ul style={styles.directiveCollection} className="clearfix">
          {_.map(viewData.directives, (outcome, idx) => {
              let lastItemStyle = idx === viewData.directives.length-1 ? styles.directiveItemLast : null;
              return (
                <div key={`outcome_${idx}`}
                    style={[styles.directiveItem, view.currentDirective === outcome ? styles.directiveItemSelected : null, lastItemStyle]}
                    onClick={(e) => props.onClickDirective(outcome, 'dashboard.questionsView')}>
                  <p style={styles.directiveText}>{outcome.displayName.text}</p>
                </div>
              )
          })}
        </ul>
      </div>

      <div style={styles.questionSection}>
        <p style={styles.label}>STUDENTS WHO DID NOT ACHIEVE QUESTION</p>
        {questionCollection}
      </div>

    </div>

  )

}
