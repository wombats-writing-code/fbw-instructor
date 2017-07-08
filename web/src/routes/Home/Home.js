import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import _ from 'lodash'

import Courses from './views/Courses'

class Home extends Component {
  render() {
    let props = this.props;

    return (
      <div>
        <div className="medium-12 large-6 columns end">
          <Courses courses={props.courses} currentCourse={props.currentCourse}
                    onClickCourse={(course) => props.onClickCourse(course, props.user, props.authenticatedUrl)} />

        </div>
      </div>
    )
  }
}

export default Home
