'use strict';

import React, {Component} from 'react'

// import MissionComponent from 'fbw-platform-common/components/mission/web/Mission'
// import MissionContainer from  'fbw-platform-common/components/mission/MissionContainer'
// const Mission = MissionContainer(MissionComponent)

import QuestionsComponent from 'fbw-platform-common/components/questions/web/Questions'
import QuestionContainer from  'fbw-platform-common/components/questions/QuestionsContainer'
const Questions = QuestionContainer(QuestionsComponent)

import LoadingBox from '../../components/LoadingBox'
import './Student.scss'

class Student extends Component {

  constructor() {
    super();
  }

  render() {

    return (
      <Questions />
    )
  }

}

export default Student
