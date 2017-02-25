import React, {Component} from 'react'
import _ from 'lodash';
const moment = require('moment');

import LoadingBox from '../../../components/LoadingBox'

import './Courses.scss'

class Courses extends Component {

  render() {
    let props = this.props;

    return (
      <div className="side-bar">
        <ul className="clickable-list">
          {_.map(props.courses, (course, idx) => {
            let key = `course_${idx}`;
            let isSelected = (props.currentCourse && course.Code === props.currentCourse.Code);

            return (
              <li key={key} className={isSelected ? "clickable-row__item is-selected" : "clickable-row__item"}
                            onClick={() => props.onClickCourse(course)}>

                <div >
                  <p className="row-title">{course.Name}</p>
                  <p className="row-subtitle">{course.description && course.description ? course.description : course.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Courses