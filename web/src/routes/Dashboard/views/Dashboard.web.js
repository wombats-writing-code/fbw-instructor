

import React, {Component} from 'react'

import {QuestionsViewWeb} from './QuestionsView.web'
// import {OutcomesViewWeb} from './OutcomesView.web'
import {PreflightViewWeb} from './PreflightView.web'
import {ConfirmViewWeb} from './ConfirmView.web'
import {TestflightViewWeb} from './TestflightView.web'

import LoadingBox from '../../../components/LoadingBox'

let styles = {
  navBar: {
    display: 'flex',
    alignItems: 'center'
  },
  viewControl: {
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    flex: 3
  },
  viewControlChild: {
    flexGrow: 1
  },
  viewControlButton: {
    display: 'block',
    borderRadius: 0,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#fff',
    fontWeight: "600"
  },
  viewControlButtonActive: {
    backgroundColor: '#72bd9a',
    cursor: 'default'
  },
  navBarTitle: {
    color: '#777',
    fontWeight: "700",
    fontSize: "1rem",
    flex: 1,
    textAlign: 'left'
  },
  processNumber: {
    color: '#eee',
    fontWeight: "600",
    marginRight: '1em'
  }
}

export const DashboardViewWeb = (props) => {

  // if (!props.mission) return null;

  let view;
  let dashboardNav;
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

    dashboardNav = (
      <div style={styles.navBar}>
        <p style={styles.navBarTitle} onMouseOver={() => props.getResults(props.mission)}>{props.mission ? props.mission.displayName.text : ''}</p>
        <ul className="button-group" style={styles.viewControl}>
          <li style={styles.viewControlChild}>
            <a className="button" style={[styles.viewControlButton, props.view.name === 'dashboard.preflightView' ? styles.viewControlButtonActive : null]}
              onClick={() => {
                props.onChangeView('dashboard.preflightView'); props.getResults(props.mission);
              }}>
              <span style={styles.processNumber}>1</span>
              Preflight
              </a>
          </li>
          <li style={styles.viewControlChild}>
            <a className="button" style={[styles.viewControlButton, props.view.name === 'dashboard.confirmView' ? styles.viewControlButtonActive : null]}
              onClick={() => props.onChangeView('dashboard.confirmView')}>
              <span style={styles.processNumber}>2</span>
              Set</a>
          </li>
          <li style={styles.viewControlChild}>
            <a className="button" style={[styles.viewControlButton, props.view.name === 'dashboard.testflightView' ? styles.viewControlButtonActive : null]}
              onClick={() => {
                  props.onChangeView('dashboard.testflightView'); props.getResultsAll(props.mission, props.currentBankId)
              }}>
              <span style={styles.processNumber}>3</span>
              Testflight
              </a>
          </li>
        </ul>
      </div>
    )
  }

  let loadingBox;
  if (props.isGetResultsInProgress) {
    loadingBox = LoadingBox('enter-active');
  } else {
    loadingBox = LoadingBox('enter');
  }

//   <ul className="button-group" style={styles.viewControl}>
//     <li style={styles.viewControlChild}>
//       <a className="button" style={[styles.viewControlButton, props.view.name === 'dashboard.questionsView' ? styles.viewControlButtonActive : null]}
//         onClick={() => props.onChangeView('dashboard.questionsView')}>Questions View</a>
//     </li>
//     <li style={styles.viewControlChild}>
//       <a className="button" style={[styles.viewControlButton, props.view.name === 'dashboard.outcomesView' ? styles.viewControlButtonActive : null]}
//         onClick={() => props.onChangeView('dashboard.outcomesView')}>Outcomes View</a>
//     </li>
//     <li style={styles.viewControlChild}>
//       <a className="button" style={[styles.viewControlButton, props.view.name === 'dashboard.studentView' ? styles.viewControlButtonActive : null]}
//         onClick={() => props.onChangeView('dashboard.studentView')}>Student View</a>
//     </li>
// </ul>

  return (
    <div>
      <div className="row">
        {dashboardNav}
        {view}

        {loadingBox}
      </div>

    </div>
  )

}
