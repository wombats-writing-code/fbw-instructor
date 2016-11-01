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

  return (
    <div style={styles.container}>
      <p>The Fly-by-Wire system recommends the following action to take:</p>
    <button className="button button-secondary">Approve and launch for all</button>
    <button className="button button-secondary">Approve and launch for all</button>

      <ul style={styles.studentCollection}>
        {_.map(viewData.students, (student, idx) => {
          return (
            <li key={`student_${idx}`}>
              <p> <span key={`studentName__${idx}`} style={styles.studentName}>{student.name}</span>
                  <span> will get </span>
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
