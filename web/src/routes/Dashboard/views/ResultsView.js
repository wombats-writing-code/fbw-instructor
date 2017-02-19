import React, {Component} from 'react';
import _ from 'lodash'

import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../components/QuestionResult'
import DirectiveCarousel from 'fbw-platform-common/components/mission/web/DirectiveCarousel'
import {osidToDisplayName, d2LDisplayNameToDisplayName} from 'fbw-platform-common/selectors/login'
import StudentLink from '../components/StudentLink'
// import TargetCarouselComponent from 'fbw-platform-common/components/mission/web/TargetCarousel'
// import TargetCarouselContainer from 'fbw-platform-common/components/mission/TargetCarouselContainer'
// const TargetCarousel = TargetCarouselContainer(TargetCarouselComponent)

// we make a local copy of TargetCarousel here and change it
// because our needs are slightly different from the one in common
// after Unit 1, we'll refactor
import TargetCarousel from './TargetCarousel'


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

    if (!props.viewData) {
      return (<div className="summary-bar empty-results clearfix">
        <p className="empty-results-text">
          Please click the Mission again to reload results.
        </p>
      </div>);
    }

    if (props.results.length === 0) {
      <p className="empty-results-text">
        No students have taken {props.missionType} yet, so no results available.
        Check back later.
      </p>
    }


    let directiveCarousel;
    if (this.state.isExpanded) {
      directiveCarousel = (
        <DirectiveCarousel directives={viewData.directives}
                          directiveIndicators={viewData.directiveIndicators}
                          currentDirectiveIndex={props.currentDirectiveIndex}
                          onSelectDirective={(idx) => props.onClickDirective(idx)}
        />
      )
    }

    let targetCarousel, questionResult;
    if (this.state.isExpanded && props.currentMission && props.currentMission.sections) {
      targetCarousel = (<TargetCarousel currentDirectiveIndex={props.currentDirectiveIndex}
                      currentTarget={props.currentTarget}
                      currentMissionSections={props.currentMission.sections}
                      targets={props.viewData.targetResultsByDirectiveIndex[props.currentDirectiveIndex]}
                      outcomes={props.outcomes}
                      onSelectTarget={props.onClickTarget}
                    />)

      if (props.currentTarget) {
        questionResult = <QuestionResult
                            result={props.currentTarget}
                            outcome={viewData.directives[props.currentDirectiveIndex]}
                            studentsAchieved={props.currentTarget.total - props.currentTarget.notAchieved}
                            studentsNotAchieved={props.currentTarget.notAchieved}
                            onSelectMissionResult={(studentResult) =>
                                this.props.onSelectMissionResult(studentResult, props.currentDirectiveIndex, props.currentTarget)}
                        />
      }
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
        <div className="student-summary">
          <p className="student-summary__list">
            <span className="bold">Opened up the mission: </span>
            {_.map(props.viewData.results, studentResult => {
              return (<StudentLink key={studentResult.takingAgentId} className="students-list__item"
                                  studentResult={studentResult}
                                  onSelectResult={(studentResult) =>
                                    this.props.onSelectMissionResult(studentResult, 0, null)}
                      />)
            })}
          </p>
          <p className="student-summary__list">
            <span className="bold">Not opened the mission: </span>
            {_.map(props.viewData.studentsNotTaken, rosterStudent => {
              return (<span key={`not-opened-${rosterStudent.ProfileIdentifier}`} className="students-list__item">
                {d2LDisplayNameToDisplayName(rosterStudent.DisplayName)}
              </span>)
            })}
          </p>
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
            <p className="summary__number">{props.results ? props.results.length : 0}</p>
            <p className="summary__text">opened the mission</p>
          </div>

          <div className="summary-blurb flex-container align-center">
            <p className="summary__number">{props.results ? props.results.studentsNotTaken.length : 0}</p>
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
        {targetCarousel}
        {questionResult}

        {/* {questionCollection} */}

      </div>
    )
  }


}

export default ResultsView
