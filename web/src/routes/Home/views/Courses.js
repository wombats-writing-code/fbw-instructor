import React, {Component} from 'react'
import _ from 'lodash';
const moment = require('moment');

import LoadingBox from '@wombats-writing-code/fbw-platform-common/components/loading-box/web/LoadingBox'

import './Courses.scss'

class Courses extends Component {

  render() {
    let props = this.props;

    return (
      <div className="side-bar">
        <ul className="clickable-list">
          {_.map(props.courses, (course, idx) => {
            let key = `course_${idx}`;

            return (
              <li key={key} className={"clickable-row__item"}
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
