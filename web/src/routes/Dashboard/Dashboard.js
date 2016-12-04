'use strict';

import React, {Component} from 'react'
import Radium from 'radium'

import ResultsView from './containers/ResultsViewContainer'
import {ConfirmViewWeb} from './views/ConfirmView.web'

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
      view = <ResultsView isGetResultsInProgress={this.props.isGetResultsInProgress} results={this.props.results}/>

      let className = "button dashboard-nav__button";
      let isActiveClassName = className + ' is-active';
    }


    let loadingBox;
    if (props.isGetResultsInProgress) {
      loadingBox = LoadingBox('enter-active');
    } else {
      loadingBox = LoadingBox('enter');
    }

    return (
      <div className="row">
        {dashboardNav}
        {view}

        {loadingBox}
      </div>

    )
  }

}

export default Dashboard
