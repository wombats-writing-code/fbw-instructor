import React, {Component} from 'react'
import {Link} from 'react-router'
import slug from 'slug'
import {getD2LDisplayName} from 'fbw-platform-common/selectors/login'


import './StudentLink.scss'


const StudentLink = (props) => {

  let student = props.student;
  let studentDisplayName = getD2LDisplayName(student);

  return (
    <Link key={student.Identifier} className="students-list__item"
              onClick={() => props.onSelectResult(student)}
              to={`/students/${studentDisplayName}/missions/${slug(studentDisplayName)}`}
              target="_blank">{studentDisplayName}</Link>
  )
}

export default StudentLink
