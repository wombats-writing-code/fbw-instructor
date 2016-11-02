import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'
import LoadingBox from '../../../components/LoadingBox'

let styles = {
  studentCollection: {
    listStyle: 'none',
    textAlign: 'left',
    fontSize: '.875rem'
  },
  studentName: {
    color: BASE_STYLES.linkColor,
    textDecoration: 'underline',
    cursor: 'default',
    ':hover': {
      opacity: .7
    }
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
  if (props.spawnedMissions) {
    spawnStatus = (
      <p> Completed spawning testflight missions!</p>
    )
    spawnVerb = 'got';

  } else if (!props.isSpawnInProgress && !props.spawnedMissions) {
    <p>The Fly-by-Wire system recommends the following action to take:</p>

    spawnStatus = (<button className="button button-secondary"
                    onClick={() => props.createTestFlightMissions(viewData.students, props.currentBankId, props.mission)}>
                    Approve and launch for all</button>
                )

    spawnVerb = 'will get';
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
      {loadingBox}

    </div>

  )

}
