'use strict';

import React, {Component} from 'react'
import Radium from 'radium'

import {QuestionsViewWeb} from './views/QuestionsView.web'
// import {OutcomesViewWeb} from './OutcomesView.web'
import {PreflightViewWeb} from './views/PreflightView.web'
import {ConfirmViewWeb} from './views/ConfirmView.web'
import {TestflightViewWeb} from './views/TestflightView.web'

import LoadingBox from '../../components/LoadingBox'
import './Dashboard.scss'

@Radium
class Dashboard extends Component {

  componentDidMount() {
  }

  render() {
    let props = this.props;

    let view, dashboardNav;
    if (props.mission) {
      switch (props.view.name) {
        case 'dashboard.questionsView':
          // view = QuestionsViewWeb(props);

        case 'dashboard.outcomesView':
          // view = OutcomesViewWeb(props);

        case 'dashboard.preflightView':
          view = PreflightViewWeb(props);
          break;

        case 'dashboard.confirmView':
          view = ConfirmViewWeb(props);
          break;

        case 'dashboard.testflightView':
          view = TestflightViewWeb(props);
      }

      let className = "button dashboard-nav__button";
      let isActiveClassName = className + ' is-active';

      dashboardNav = (
        <div className="dashboard-nav flex-container align-center" >
          <button className={props.view.name === "dashboard.preflightView" ? isActiveClassName : className}
            onClick={() => {
              props.onChangeView('dashboard.preflightView'); props.getResults(props.mission);
            }}>
            <span className="button-text__ordinal">1</span>
            Phase I Results
            </button>

          <button className={props.view.name === "dashboard.confirmView" ? isActiveClassName : className}
            onClick={() => props.onChangeView('dashboard.confirmView')}>
            <span className="button-text__ordinal">2</span>
            Set</button>

          <button className={props.view.name === "dashboard.testflightView" ? isActiveClassName : className}
            onClick={() => {
                props.onChangeView('dashboard.testflightView'); props.getResultsAll(props.mission, props.currentBankId)
            }}>
            <span className="button-text__ordinal">3</span>
            Phase II Results
            </button>
        </div>
      )
    }


    let loadingBox;
    if (props.isGetResultsInProgress) {
      loadingBox = LoadingBox('enter-active');
    } else {
      loadingBox = LoadingBox('enter');
    }

    return (
      <div>
        <p>{props.mission ? props.mission.displayName.text : ''}</p>

        <div className="row">
          {dashboardNav}
          {view}

          {loadingBox}
        </div>

      </div>
    )
  }


  // setResults = (offeredResults) => {
  //     //offeredResults will be a list of takens, each taken
  //     // will have a list of questions, with each questions
  //     // having a list of responses.
  //     //  [
  //     //    {
  //     //      displayName, description, id, etc.
  //     //      questions: [
  //     //        itemId:  < use this field to match across students >
  //     //        text.text: < show this as a preview to faculty >
  //     //        responses: [ <null> or { isCorrect: state,
  //     //                                 submissionTime: ISO time string }]  < may have to sort by submissionTime? >
  //     //        learningObjectiveIds: [ < use this for outcomes view > ]
  //     //      ]
  //     //    }
  //     // ]
  //
  //     // console.log('got results');
  //     // console.log(offeredResults);
  //
  //     // So first, let's save the results in state, then
  //     // pass that along to the QuestionsView
  //     // Remember to pass a number value (i.e. student got it right in X tries)
  //     this.setState({results: offeredResults,
  //                    loading: false});
  // }
  //
  // _getOrdinal(number) {
  //   if (number === 1) {
  //     return 'st';
  //   } else if (number === 2) {
  //     return 'nd';
  //   } else if (number === 3) {
  //     return 'rd';
  //   } else {
  //     return 'th'
  //   }
  // }
  //
  // handlePressNode(node) {
  //   console.log('node was pressed', node);
  // }

}

export default Dashboard
