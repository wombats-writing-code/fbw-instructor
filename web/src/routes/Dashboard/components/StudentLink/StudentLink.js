import React, {Component} from 'react'
import _ from 'lodash'
import {Link} from 'react-router'
import slug from 'slug'
import {getD2LDisplayName} from '@wombats-writing-code/fbw-platform-common/selectors/login'


import './StudentLink.scss'


const StudentLink = (props) => {
  let student = props.student;
  if (!student) return null;

  let studentDisplayName = getD2LDisplayName(student);


  return (
    <Link key={student.Identifier}
              onClick={() => props.onSelectStudent(student) }
              to={`/students/${slug(studentDisplayName)}/missions/${slug(props.mission.displayName)}`}
              target="">{studentDisplayName}</Link>
  )
}


export default StudentLink
