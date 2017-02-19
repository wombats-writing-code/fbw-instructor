import React, {Component} from 'react'
const moment = require('moment')
import LoadingBox from '../LoadingBox'

// import CoursesComponent from 'fbw-platform-common/components/courses/web/Courses'
// import CoursesContainer from 'fbw-platform-common/components/courses/CoursesContainer';
// const Courses = CoursesContainer(CoursesComponent);

import './SideBar.scss'

export default (props) => {

  // === createMissionButton: show only when missions are loaded. not sure why, but it errors out otherwise
  let createMissionButton;
  if (!props.isGetMissionsInProgress && props.missions) {
    createMissionButton = <button className="button create-mission-button"
                                  onClick={() => props.onClickAddMission()}>&#x0002B; Create a mission</button>
  }


  return (
    <div className="side-bar">
    <ul className="clickable-list">
      {_.map(props.courses, (course, idx) => {
        let key = `course_${idx}`;
        let isSelected = (props.currentCourse && course.Code === props.currentCourse.Code);

        return (
          <li key={key} className={isSelected ? "clickable-row__item is-selected" : "clickable-row__item"}
                        onClick={() => props.onClickCourse(course, props.username)}>

            <div >
              <p className="row-title">{course.Name}</p>
              <p className="row-subtitle">{course.description && course.description ? course.description : course.description}</p>
            </div>
          </li>
        )
      })}
    </ul>

    {createMissionButton}

    {missionCollection}
    {missionsLoadingBox}
    </div>
  )
}
