import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import LoadingBox from '../../../components/LoadingBox'

import {
  SingleDatePicker
} from 'react-dates'
import 'react-dates/css/variables.scss'
import 'react-dates/css/styles.scss'

require('./datepicker.css')

let styles = {
  studentCollection: {
    marginLeft: 0,
    listStyle: 'none',
    textAlign: 'left',
    fontSize: '.875rem',
    marginBottom: '2.625rem'
  },
  studentName: {
    color: BASE_STYLES.linkColor,
    textDecoration: 'underline',
    cursor: 'default',
    ':hover': {
      opacity: .7
    }
  },
  spawnStatus: {
    color: '#333',
    textAlign: 'left',
    marginTop: '1.5rem',
    marginBottom: '1.5rem'
  },
  spawnButton: {
    width: '100%'
  }
}

const _getPlurality = (number) => {
  if (number === 1) return '';

  return 's';
}


const createMarkup = (htmlString) => {
  return {__html: htmlString};
}

export const ConfirmViewWeb = (props) => {

  let view = props.view;
  let viewData = props.viewData;

  let loadingBox;
  if (!props.isSpawnInProgress) {
    loadingBox = LoadingBox('enter')

  } else if (props.isSpawnInProgress) {
    loadingBox = LoadingBox('enter-active')
  }

  let spawnStatus;
  let spawnVerb;
  let spawnButton;
  let spawnDate;
  if (props.mission.hasSpawnedFollowOnPhase || props.spawnedMissions) {
    spawnStatus = (
      <p style={styles.spawnStatus}>
        Testflight missions have been created. Every student has received a personalized mission targeting the directives they missed:
      </p>
    )
    spawnVerb = 'received';

  } else if (!props.isSpawnInProgress && !props.spawnedMissions) {

    spawnStatus = <p style={styles.spawnStatus}>
      Your Fly-by-Wire system recommends to give personalized Testflight missions:</p>
    spawnVerb = 'will get';

    if (props.spawnDate) {
      spawnButton = (<button className="button button-secondary" style={styles.spawnButton}
      onClick={() => props.createTestFlightMissions(viewData.students, props.currentBankId, props.mission, props.spawnDate)}>
      Approve and launch for all</button>)
    }

    spawnDate = (
      <SingleDatePicker date={props.spawnDate}
                        onDateChange={(date) => props.updateSpawnDate({date: date})}
                        focused={props.spawnDateFocused}
                        onFocusChange={props.updateSpawnDate} />
      )

  }

  let studentCollection;
  if (!props.isSpawnInProgress) {
    studentCollection = (
      <ul style={styles.studentCollection}>
        {_.map(viewData.students, (student, idx) => {
          return (
            <li key={`student_${idx}`}>
              <p> <span key={`studentName__${idx}`} style={styles.studentName}>{student.name}</span>
                  <span> {spawnVerb} </span>
                  <span>{student.nextMission.directives.length} </span>
                <span>directive{_getPlurality(student.nextMission.directives.length)} with a total of </span>
                  <span>{student.nextMission.numberItemsForDirectives} </span>
                  question{_getPlurality(student.nextMission.numberItemsForDirectives)}.</p>
            </li>
          )
        })}
      </ul>
    )
  }

  // TODO: I think we still need to include a "release date" option for launching these

  return (
    <div style={styles.container}>
      {spawnStatus}
      {studentCollection}
      {spawnDate}
      {spawnButton}
      {loadingBox}

    </div>

  )

}
