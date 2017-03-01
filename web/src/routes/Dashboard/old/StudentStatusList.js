import React, {Component} from 'react';
import _ from 'lodash'

import {getD2LDisplayName} from 'fbw-platform-common/selectors/login'
import StudentLink from '../components/StudentLink'

import './StudentStatusList.scss'

const StudentStatusList = (props) => {

  return (
    <div className="student-summary">
      <p className="bold">Opened up the mission: </p>
      <ol className="student-summary__list">
        {_.map(props.studentsOpened, student => {
          return (
            <li key={student.Identifier}>
                  <StudentLink className="students-list__item"
                              student={student}
                              onSelectResult={(student) =>
                                this.props.onSelectStudentResult(student, 0, null)}
                  />
            </li>)
        })}
      </ol>

      <p className="bold">Not opened the mission: </p>
      <ol className="student-summary__list">
        {_.map(props.studentsNotOpened, (student, idx) => {
          return (<li key={`not-opened-${student.Identifer}-${idx}`} className="students-list__item">
            {getD2LDisplayName(student)}
          </li>)
        })}
      </ol>
    </div>
  )
}

export default StudentStatusList
