

import React, {Component} from 'react'

import {QuestionsViewWeb} from './QuestionsView.web'
import {OutcomesViewWeb} from './OutcomesView.web'

import LoadingBox from '../../../components/LoadingBox'

let styles = {
  viewControl: {
    width: '100%',
    display: 'flex',
    marginLeft: 0
    // justifyContent: 'space-around',

  },
  buttonGroupChild: {
    flexGrow: 1
  },
  viewControlButton: {
    display: 'block',
    borderRadius: 0,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#fff',
    fontWeight: "500"
  },
  viewControlButtonActive: {
    backgroundColor: '#72bd9a',
    cursor: 'default'
  },
  navBarTitle: {
    color: '#777',
    fontWeight: "700",
    fontSize: "1rem"
  }
}

export const DashboardViewWeb = (props) => {

  let view;
  if (props.view.name === 'dashboard.questionsView') {
    view = QuestionsViewWeb(props);

  } else if (props.view.name === 'dashboard.outcomesView') {
    view = OutcomesViewWeb(props);
  }

  let loadingBox;
  if (!props.isGetResultsInProgress) {
    loadingBox = LoadingBox('enter');
  } else {
    loadingBox = LoadingBox('enter-active');
  }

  return (
    <div>
      <p style={styles.navBarTitle}>{props.mission ? props.mission.displayName.text : ''}</p>

      <ul className="button-group" style={styles.viewControl}>
        <li style={styles.buttonGroupChild}>
          <a className="button" style={[styles.viewControlButton, props.view.name === 'dashboard.questionsView' ? styles.viewControlButtonActive : null]}
            onClick={() => props.onChangeView('dashboard.questionsView')}>Questions View</a>
        </li>
        <li style={styles.buttonGroupChild}>
          <a className="button" style={styles.viewControlButton}
            onClick={() => props.onChangeView('dashboard.outcomesView')}>Outcomes View</a>
        </li>
        <li style={styles.buttonGroupChild}>
          <a className="button" style={styles.viewControlButton}
            onClick={() => props.onChangeView('dashboard.outcomesView')}>Student View</a>
        </li>
      </ul>

      <div className="row">
        {view}
        <div className="columns">
          {loadingBox}
        </div>
      </div>
    </div>
  )

}
