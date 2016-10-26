

import React, {Component} from 'react'

import {QuestionsViewWeb} from './QuestionsView.web'
import {OutcomesViewWeb} from './OutcomesView.web'


let styles = {
  viewControl: {
    display: 'flex',
    justifyContent: 'space-around',

  },
  viewControlButton: {

  }
}

export const DashboardViewWeb = (props) => {

  let view;
  if (props.view.name === 'dashboard.questionsView') {
    view = QuestionsViewWeb(props);

  } else if (props.view.name === 'dashboard.outcomesView') {
    view = OutcomesViewWeb(props);
  }

  return (
    <div>
      <h3>Dashboard</h3>
      <p>{props.mission ? props.mission.displayName.text : ''}</p>

      <div className="row" style={styles.viewControl}>
        <button className="button" onClick={() => props.onChangeView('dashboard.questionsView')}>Questions View</button>
      <button className="button" onClick={() => props.onChangeView('dashboard.outcomesView')}>Outcomes View</button>
    <button className="button" onClick={() => props.onChangeView('dashboard.outcomesView')}>Student View</button>
      </div>

      <div className="row">
        {view}
      </div>
    </div>
  )

}
