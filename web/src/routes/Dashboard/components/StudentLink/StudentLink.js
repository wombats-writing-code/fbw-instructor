import React, {Component} from 'react'
import {Link} from 'react-router'
import slug from 'slug'
import {osidToDisplayName} from 'fbw-platform-common/selectors/login'


import './StudentLink.scss'


const StudentLink = (props) => {

  let studentResult = props.studentResult;
  let studentDisplayName = slug(osidToDisplayName(studentResult.takingAgentId));

  return (
    <Link key={studentResult.takingAgentId} className="students-list__item"
              onClick={() => props.onSelectResult(studentResult)}
              to={`/students/${studentDisplayName}/missions/${slug(studentResult.displayName.text)}`}
              target="_blank">{studentDisplayName}</Link>
  )
}

export default StudentLink
