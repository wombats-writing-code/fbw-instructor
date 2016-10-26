

import React, {Component} from 'react'

let styles = {
  viewControl: {
    display: 'flex',
    justifyContent: 'space-around',

  },
  viewControlButton: {

  }
}

export const DashboardViewWeb = (props) => {
  return (
    <div>
      <h3>Dashboard</h3>
      <p>{props.currentMission ? props.currentMission.displayName.text : ''}</p>

    <div className="row" style={styles.viewControl}>
        <button className="button" onClick={() => props.onChangeView('questionsView')}>Questions View</button>
      <button className="button" onClick={() => props.onChangeView('outcomesView')}>Outcomes View</button>
    <button className="button" onClick={() => props.onChangeView('outcomesView')}>Student View</button>

      </div>
    </div>
  )

}
