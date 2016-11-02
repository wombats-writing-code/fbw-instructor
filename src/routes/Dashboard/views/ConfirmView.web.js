import React, {Component} from 'react';
import 'lodash'

import BASE_STYLES from '../../../styles/baseStyles'
import EmptyState from '../../../components/EmptyState'

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

  // if (!view || !viewData) {
  //   return (
  //     <div className="columns">
  //       { EmptyState('There are no results yet. Try refreshing or waiting for a student to try a question.')}
  //     </div>
  //   )
  // }

  let spawnComplete = (
    <div>
      Completed spawning testflight missions!
    </div>
      ),
    spawnVerb = 'got'

  if (!props.spawnComplete) {
    spawnVerb = 'will get'
    spawnComplete = <button className="button button-secondary"
            onClick={() => props.createTestFlightMissions(viewData.students, props.currentBankId)}>Approve and launch for all</button>
  }

  // TODO: I think we still need to include a "release date" option for launching these

  return (
    <div style={styles.container}>
      <p>The Fly-by-Wire system recommends the following action to take:</p>
      {spawnComplete}

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

    </div>

  )

}
