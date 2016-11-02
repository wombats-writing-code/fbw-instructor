import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import LoadingBox from '../../../components/LoadingBox'

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
  if (props.spawnedMissions) {
    spawnStatus = (
      <p> Completed spawning testflight missions!</p>
    )
    spawnVerb = 'got';

  } else if (!props.isSpawnInProgress && !props.spawnedMissions) {

    spawnStatus = <p style={styles.spawnStatus}>Your Fly-by-Wire system recommends to give personalized Testflight missions:</p>
    spawnVerb = 'will get';

    spawnButton = (<button className="button button-secondary" style={styles.spawnButton}
                          onClick={() => props.createTestFlightMissions(viewData.students, props.currentBankId, props.mission)}>
                          Approve and launch for all</button>)

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
                  <span>directives with a total of </span>
                  <span>{student.nextMission.numberItemsForDirectives} </span>
                  questions.</p>
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
      {spawnButton}
      {loadingBox}

    </div>

  )

}
