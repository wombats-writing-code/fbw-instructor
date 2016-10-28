
import DuckImage from '../assets/Duck.jpg'
import React from 'react'

import DashboardContainer from '../../Dashboard/'
import MissionControlContainer from '../../MissionControl/'

import BASE_STYLES from '../../../styles/baseStyles'

let styles = {
  bankCollection: {
    listStyle: 'none',
    marginLeft: 0
  },
  bankCollectionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    fontSize: '.8rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: '#ddd',
    paddingTop: '.5rem',
    paddingLeft: 10.5,
    cursor: 'pointer',
    textAlign: 'left',
    ":hover": {
      backgroundColor: '#f0f0f0'
    }
  },
  selectedBankItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    fontSize: '.8rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: '#ddd',
    paddingTop: '.5rem',
    paddingLeft: 10.5,
    cursor: 'pointer',
    textAlign: 'left',
    backgroundColor: '#2199e8',
    color: '#fefefe',
    ":hover": {
      backgroundColor: '#f0f0f0'
    }
  },
  rowItemSubtitle: {
    fontSize: '.6rem',
    color: 'darkgray'
  },
  missionCollection: {
    listStyle: 'none',
    marginLeft: 0
  },
  missionCollectionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    fontSize: '.8rem',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: '#ddd',
    paddingTop: '.5rem',
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
  if (props.view.name.startsWith('dashboard')) {
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

  let createMissionButton = <div />

  if (props.currentBank) {
    createMissionButton = <button className="button" onClick={() => props.onClickAddMission()}>Create a mission</button>
  }

  return (
    <div className="row">
      {/* <h4>Welcome!</h4>
      <img
        alt='This is a duck, because Redux!'
        className='duck'
        src={DuckImage} /> */}

      <div className="medium-3 large-3 columns"  style={styles.sidebar}>
        <ul style={styles.bankCollection}>
          {_.map(props.banks, (bank, idx) => {
            let key = `bank_${idx}`,
              bankStyles = styles.bankCollectionItem;
            if (props.currentBank) {
              if (bank.id === props.currentBank.id) {
                bankStyles = styles.selectedBankItem
              }
            }
            return (
              <li key={key} style={bankStyles} onClick={() => props.onClickBank(bank)}>
                <div style={styles.rowItemInfo}>
                  <p>{bank.displayName.text}</p>
                  <p style={styles.rowItemSubtitle}>{bank.description.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
        {createMissionButton}

        <ul style={styles.missionCollection}>
          {_.map(props.missions, (mission, idx) => {
            let key = `mission_${idx}`
            return (
              <li key={key} style={styles.missionCollectionItem} onClick={() => props.onClickMission(mission)}>
                <div style={styles.rowItemInfo}>
                  <p>{mission.displayName.text}</p>
                  <p style={styles.rowItemSubtitle}>Closes: {mission.deadline.month} - {mission.deadline.day} - {mission.deadline.year}</p>
                </div>
                <div style={styles.rowItemButtons}>
                  <button className="button small" style={styles.rowItemButton}
                          onClick={(e) => {props.onClickEditMission(mission); e.stopPropagation()}}>Edit</button>
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
