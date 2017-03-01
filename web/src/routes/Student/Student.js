import React, {Component} from 'react'

import MissionComponent from 'fbw-platform-common/components/mission/web/Mission'
import MissionContainer from  'fbw-platform-common/components/mission/MissionContainer'
const Mission = MissionContainer(MissionComponent)
import {getD2LDisplayName} from 'fbw-platform-common/selectors/login'

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
    let props = this.props;

    if (!props.mission) return null;

    // console.log('props of Student.js', props)
    // console.log('props.mission', props.mission)

    return (
      <div>
        <div className="student__nav-bar clearfix">
          <p>You are looking at <span>{getD2LDisplayName(props.student)}</span>
          &nbsp; >>
          <span> {props.mission.displayName}</span></p>
        </div>

        <Mission mission={props.mission}/>
      </div>
    )
  }

}

export default Student
