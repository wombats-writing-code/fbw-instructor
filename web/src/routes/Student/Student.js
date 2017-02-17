'use strict';

import React, {Component} from 'react'

import MissionComponent from 'fbw-platform-common/components/mission/web/Mission'
import MissionContainer from  'fbw-platform-common/components/mission/MissionContainer'
const Mission = MissionContainer(MissionComponent)

import {osidToDisplayName} from 'fbw-platform-common/selectors/login'

// import QuestionsComponent from 'fbw-platform-common/components/questions/web/Questions'
// import QuestionContainer from  'fbw-platform-common/components/questions/QuestionsContainer'
// const Questions = QuestionContainer(QuestionsComponent)

// import LoadingBox from '../../components/LoadingBox'
import './Student.scss'

class Student extends Component {

  constructor() {
    super();
  }

  render() {

    // if (!this.props.result) return null;
    console.log('props of Student.js', this.props)

    return (
      <div>
        <div className="student__nav-bar clearfix">
          <p>You are looking at <span>{osidToDisplayName(this.props.result.takingAgentId)}</span>
          &nbsp; >>
          <span> {this.props.result.displayName.text}</span></p>
        </div>
        <Mission />
      </div>
    )
  }

}

export default Student
