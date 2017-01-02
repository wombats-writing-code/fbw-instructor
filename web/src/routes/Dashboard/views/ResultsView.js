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
          {_.map(viewData.resultsByDirective[currentDirectiveId].questions, (result, idx) => {
            return <QuestionResult result={result} idx={idx}
                                  studentsAchieved={viewData.resultsByQuestion[result.questionId].studentsAchieved}
                                  studentsNotAchieved={viewData.resultsByQuestion[result.questionId].studentsNotAchieved}/>
          })}
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

    let expandCollapseButtonText;
    if (viewData && viewData.directives) {
      expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';
    } else {
      expandCollapseButtonText = 'No results yet';
    }

    // console.log('results view data', viewData)

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

          <button className=" expand-collapse-button"
                  disabled={!viewData || !viewData.directives}
                  onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
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
