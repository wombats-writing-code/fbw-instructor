import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../../../components/QuestionResult'

import './ResultsView.scss'

let styles = {
  container: {
  },
  summarySection: {
    paddingLeft: '1em',
    paddingTop: '.25rem',
    paddingBottom: '.25rem',
    marginBottom: '1.5rem',
    backgroundColor: '#f8f8f8'
  },
  detailedSection: {
    display: 'flex'
  },
  summaryBlurb: {
    maxWidth: 100,
    textAlign: 'left',
    marginLeft: 0,
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: BASE_STYLES.primaryColor,
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderRadius: '50%'
  },
  summaryNumber: {
    fontSize: "2.5em",
    fontWeight: "500",
    marginRight: ".2em",
    marginBottom: 0,
    color: BASE_STYLES.primaryColor
  },
  summaryText: {
    marginBottom: 0,
    textAlign: 'left',
    color: '#666',
    lineHeight: .9,
    fontSize: '.875rem',
    maxWidth: 60
  },
}

export default function ResultsView(props) {
  let viewData = props.viewData;
  let view = props.view;

  // if the view is not loading AND there are no results, show empty state
  if (!props.isGetResultsInProgress && !viewData) {
    return (
      <div className="columns">
        {EmptyState('There are no results yet. Try refreshing or waiting for a student to try a question.')}
      </div>
    )

  // if the view is loading or there is no results, show nothing
  } else if (props.isGetResultsInProgress || !viewData) {
    return null;
  }

  let currentDirectiveId = view.currentDirective ? view.currentDirective.id : null;
  let questionCollection;
  if (currentDirectiveId) {
    let collection = viewData.resultsByDirective[currentDirectiveId];
    // console.log('currentDirectiveId', currentDirectiveId, 'resultsByDirective', viewData.resultsByDirective, 'resultsByDirective', collection);

    questionCollection = (
      <ul className="">
        {_.map(collection.questions, (result, idx) => QuestionResult(result, idx))}
      </ul>
    )
  }

  return (
    <div style={styles.container}>

      <div className="clearfix" style={styles.summarySection}>
        <div style={styles.summaryBlurb}>
          <p style={styles.summaryNumber}>{props.results.length}</p>
          <p style={styles.summaryText}>opened up the mission</p>
        </div>
      </div>

      <div className="flex-container align-top">

        <div className="directive-section">
          <p className="section__label">DIRECTIVES</p>
          <ul className="clickable-list">
            {_.map(viewData.directives, (outcome, idx) => {
              return (
                <li key={`outcome_${idx}`}
                    className={outcome === view.currentDirective ? "clickable-row__item is-selected" : "clickable-row__item"}
                    onClick={(e) => props.onClickDirective(outcome, view.name)}>
                  <p className="outcome-text">{outcome.displayName.text}</p>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="questions-section">
          {questionCollection}
        </div>

      </div>
    </div>
  )

}
