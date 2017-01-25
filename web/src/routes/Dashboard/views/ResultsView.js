import React, {Component} from 'react';
import 'lodash'

import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../components/QuestionResult'
import DirectiveCarousel from 'fbw-platform-common/components/mission/web/DirectiveCarousel'

import {osidToDisplayName, d2LDisplayNameToDisplayName} from 'fbw-platform-common/selectors/login'

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

    // console.log('viewData in ResultsView.js', viewData)

    if (!props.viewData || !viewData.directives) {
      return (<div className="summary-bar empty-results clearfix">
        <p className="empty-results-text">
          No students have taken {props.missionType} yet, so no results available.
          Check back later.
        </p>
      </div>);
    }


    let currentDirectiveId = view.currentDirective ? view.currentDirective.id : null;
    let questionCollection;
    if (this.state.isExpanded && currentDirectiveId) {
      questionCollection = (
        <ul className="questions-section">
          {_.map(viewData.resultsByDirective[currentDirectiveId].questions, (result, idx) => {
            let questionResult = viewData.resultsByQuestion[result.questionId];

            return <QuestionResult key={`question-result-${idx}`} idx={idx}
                                  result={result}
                                  question={questionResult.question}
                                  outcome={questionResult.outcome}
                                  studentsAchieved={questionResult.studentsAchieved}
                                  studentsNotAchieved={questionResult.studentsNotAchieved}
                                  onSelectMissionResult={(studentResult) =>
                                      this.props.onSelectMissionResult(studentResult, viewData.directives.indexOf(view.currentDirective), questionResult.question)
                                  }/>
          })}
        </ul>
      )
    }

    let directiveCarousel;
    if (this.state.isExpanded) {
      directiveCarousel = (
        <DirectiveCarousel directives={viewData.directives}
                          directiveIndicators={viewData.directiveIndicators}
                          currentDirectiveIndex={viewData.directives.indexOf(view.currentDirective)}
                          onSelectDirective={(idx) => props.onClickDirective(viewData.directives[idx],view.name)}
        />
      )
    }

    let expandCollapseButtonText;
    if (viewData && viewData.directives) {
      expandCollapseButtonText = this.state.isExpanded ? 'Hide' : 'Show';
    } else {
      expandCollapseButtonText = 'No results yet';
    }

    let studentSummary;
    if (this.state.isExpanded) {
      studentSummary = (
        <div className="student-summary flex-container">
          <div className="student-summary__collection">
            <p className="bold">Opened up the mission</p>
            {_.map(props.viewData.results, student => {
              return (<p key={`opened-${student.takingAgentId}`} className="student-summary__collection__item">
                {osidToDisplayName(student.takingAgentId)}
              </p>)
            })}
          </div>
          <div className="student-summary__collection">
            <p className="bold">Not opened the mission</p>
            {_.map(props.viewData.studentsNotTaken, rosterStudent => {
              return (<p key={`not-opened-${rosterStudent.ProfileIdentifier}`} className="student-summary__collection__item">
                {d2LDisplayNameToDisplayName(rosterStudent.DisplayName)}
              </p>)
            })}
          </div>
        </div>
      )
    }

    // console.log('results view data', viewData)

    return (
      <div className="results-view ">

        <div className="flex-container align-center summary-bar">
          <p className="summary__mission-name">
            {props.mission.displayName.text}
            <span className="summary__mission-name-type">{props.missionType}</span>
          </p>

          <div className="summary-blurb flex-container align-center">
            <p className="summary__number">{props.viewData ? props.viewData.results.length : 0}</p>
            <p className="summary__text">opened the mission</p>
          </div>

          <div className="summary-blurb flex-container align-center">
            <p className="summary__number">{props.viewData ? props.viewData.studentsNotTaken.length : 0}</p>
            <p className="summary__text">not opened</p>
          </div>

          <button className=" expand-collapse-button"
                  disabled={!viewData || !viewData.directives}
                  onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
            {expandCollapseButtonText}
          </button>
        </div>

        {studentSummary}
        {directiveCarousel}
        {questionCollection}

      </div>
    )
  }


}

export default ResultsView
