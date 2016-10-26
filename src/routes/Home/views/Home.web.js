
import DuckImage from '../assets/Duck.jpg'
import React from 'react'

import DashboardContainer from '../../Dashboard/'
import MissionControlContainer from '../../MissionControl/'

import BASE_STYLES from '../../../styles/baseStyles'

let styles = {
  missionCollection: {
    listStyle: 'none',
    marginLeft: 0
  },
  missionCollectionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    fontSize: '.875rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: '#ddd',
    paddingTop: '1.125rem',
    paddingLeft: 10.5,
    cursor: 'pointer',
    textAlign: 'left',
    ":hover": {
      backgroundColor: '#f0f0f0'
    }
  },
  rowItemInfo: {
    flex: 3
  },
  rowItemButtons: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  }
}

export const HomeViewWeb = (props) => {

  let view;
  if (props.view.name === 'dashboard') {
    view = (
      <div>
        <DashboardContainer.component></DashboardContainer.component>
      </div>
    )
  } else if (props.view.name === 'add-mission' || props.view.name === 'edit-mission') {
    view = (
      <div>
        <MissionControlContainer.component></MissionControlContainer.component>
      </div>
    )
  }

  return (
    <div className="row">
      {/* <h4>Welcome!</h4>
      <img
        alt='This is a duck, because Redux!'
        className='duck'
        src={DuckImage} /> */}

      <div className="medium-3 large-3 columns"  style={styles.sidebar}>
        <button className="button" onClick={() => props.onClickAddMission()}>Create a mission</button>

        <ul style={styles.missionCollection}>
          {_.map(props.missions, (mission, idx) => {
            return (
              <li key={idx} style={styles.missionCollectionItem} onClick={() => props.onClickMission(mission)}>
                <div style={styles.rowItemInfo}>
                  <p>{mission.displayName.text}</p>
                  <p>{mission.description.text}</p>
                </div>
                <div style={styles.rowItemButtons}>
                  <button className="button small" style={styles.rowItemButton}
                          onClick={() => props.onClickEditMission(mission)}>Edit</button>

                  <button className="button small" style={styles.rowItemButton}
                          onClick={() => props.onClickViewMission(mission)}>View</button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="medium-9 large-9 columns">
        {view}
      </div>


    </div>
  )
}
