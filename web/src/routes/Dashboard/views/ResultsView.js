import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../components/QuestionResult'
import DirectiveCarousel from '../components/carousel/DirectiveCarousel'


import './ResultsView.scss'

class ResultsView extends Component {

  constructor() {
    super();

    this.state = {
      isExpanded: false,
    }
  }

  render() {
    let props = this.props;
    let viewData = props.viewData;
    let view = props.view;

    let currentDirectiveId = view.currentDirective ? view.currentDirective.id : null;
    let questionCollection;
    if (this.state.isExpanded && currentDirectiveId) {
      questionCollection = (
        <ul className="questions-section">
          {_.map(viewData.resultsByDirective[currentDirectiveId].questions, (result, idx) => QuestionResult(result, idx))}
        </ul>
      )
    }

    let directiveCarousel;
    if (this.state.isExpanded) {
      directiveCarousel = (
        <DirectiveCarousel targets={[]}
                          directives={viewData.directives}
                          currentDirective={view.currentDirective}
                          onSelectDirective={_.partialRight(props.onClickDirective, view.name)}/>
      )
    }

    let expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';

    return (
      <div className="results-view columns">

        <div className="flex-container align-center summary-bar">
          <p className="summary__mission-name">
            {props.mission.displayName.text}
            <span className="summary__mission-name-type">{props.missionType}</span>
          </p>

          <div className="summary-blurb flex-container align-center">
            <p className="summary__number">{props.viewData ? props.viewData.results.length : 0}</p>
            <p className="summary__text">tried the mission</p>
          </div>

          <div className="summary-blurb flex-container align-center">
            <p className="summary__number warning-color">{props.viewData ? props.viewData.studentsReallyStruggled.length : 0}</p>
            <p className="summary__text">students really struggled</p>
          </div>

          <button className=" expand-collapse-button" onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
            {expandCollapseButtonText}
          </button>
        </div>

        {directiveCarousel}
        {questionCollection}

      </div>
    )
  }


}

export default ResultsView
