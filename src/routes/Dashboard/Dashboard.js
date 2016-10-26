'use strict';

import React, {Component} from 'react'
import Radium from 'radium'

import {DashboardViewWeb} from './views/Dashboard.web'

// var styles = require('./Dashboard.styles');
// import QuestionsView from './questions-view/QuestionsView';
// import TreeView from './tree-view/TreeView';
// import {} from './processResults'

@Radium
class Dashboard extends Component {

  componentDidMount() {
    this.props.getResults();
  }

  render() {
      return DashboardViewWeb(this.props);
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
