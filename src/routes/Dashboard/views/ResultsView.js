import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../../../components/QuestionResult'
import DirectiveCarousel from '../../../components/carousel/DirectiveCarousel'

import './ResultsView.scss'

let styles = {

  summarySection: {
    paddingLeft: '1em',
    paddingTop: '.25rem',
    paddingBottom: '.25rem',
    marginBottom: '1.5rem',
    backgroundColor: '#f8f8f8'
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
      <ul className="questions-section">
        {_.map(collection.questions, (result, idx) => QuestionResult(result, idx))}
      </ul>
    )
  }

  return (
    <div style={styles.container}>

      <div className="flex-container align-center summary-bar">
        <p className="summary__mission-name">{props.mission ? props.mission.displayName.text : ''}</p>

        <div className="summary-blurb flex-container align-center">
          <p className="summary__number">{props.results.length}</p>
          <p className="summary__text">tried the mission</p>
        </div>

        <div className="summary-blurb flex-container align-center">
          <p className="summary__number warning-color">{props.viewData.questions.length}</p>
          <p className="summary__text">questions are really problematic</p>
        </div>
      </div>

      <DirectiveCarousel targets={[]}
                        directives={viewData.directives}
                        currentDirective={view.currentDirective}
                        onSelectDirective={_.partialRight(props.onClickDirective, view.name)}/>

      {questionCollection}

    </div>
  )

}
