import React, {Component} from 'react'
import slug from 'slug'

import EmptyState from 'fbw-platform-common/components/empty-state/web/'
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

    // console.log('missionName', props.params.missionName)
    // console.log('slugged:', slug(props.params.missionName), slug('test 1'))
    // console.log('props.mission', props.mission)

    if (!props.mission || !props.mission.questions || props.mission.questions.length === 0) {
      return (
        <div className="small-12 medium-8 medium-centered">
          {EmptyState(`${getD2LDisplayName(props.student)} has not opened their mission yet.`)}
        </div>
      )
    }

    return (
      <div>
        <div className="student__nav-bar clearfix">
          <p>You are looking at <span>{getD2LDisplayName(props.student)}</span>
          &nbsp; >>
          <span> {props.mission.displayName}</span></p>
        </div>

        <Mission user={props.student}
          mission={props.mission}
          doNotTakeMission={true}/>
      </div>
    )
  }

}

export default Student
