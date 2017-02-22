import React, {Component} from 'react';
import _ from 'lodash'

import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../components/QuestionResult'
import DirectiveCarousel from 'fbw-platform-common/components/mission/web/DirectiveCarousel'
import {getD2LDisplayName} from 'fbw-platform-common/selectors/login'
import StudentLink from '../components/StudentLink'
// import TargetCarouselComponent from 'fbw-platform-common/components/mission/web/TargetCarousel'
// import TargetCarouselContainer from 'fbw-platform-common/components/mission/TargetCarouselContainer'
// const TargetCarousel = TargetCarouselContainer(TargetCarouselComponent)

// we make a local copy of TargetCarousel here and change it
// because our needs are slightly different from the one in common
// after Unit 1, we'll refactor
import TargetCarousel from './TargetCarousel'


import './ResultsView.scss'

class ResultsView extends Component {

  constructor() {
    super();

    this.state = {
      isExpanded: false,
    }
  }

  render() {
    let results = this.props.results;

    // console.log('props of ResultsView', results)

    return (
      <div>
        <div className="student-summary">
          <p className="bold">Opened up the mission: </p>
          <ol className="student-summary__list">
            {_.map(results.studentsOpened, student => {
              return (
                <li key={student.Identifier}>
                      <StudentLink className="students-list__item"
                                  student={student}
                                  onSelectResult={(student) =>
                                    this.props.onSelectStudentResult(student, 0, null)}
                      />
                </li>)
            })}
          </ol>

          <p className="bold">Not opened the mission: </p>
          <ol className="student-summary__list">
            {_.map(results.studentsNotOpened, (student, idx) => {
              return (<li key={`not-opened-${student.Identifer}-${idx}`} className="students-list__item">
                {getD2LDisplayName(student)}
              </li>)
            })}
          </ol>
        </div>

        <div className="questions-summary">
          <p className="bold">Questions most missed: </p>
          <ul>
            {_.map(results.incorrectQuestionsRanked, (recordsForQuestion) => {
              // console.log(recordsForQuestion[0].question.id)
              return (
                <li key={`incorrect-question-${recordsForQuestion[0].question.id}`}>
                  <div>
                    {_.map(recordsForQuestion, (record, idx) => {
                      let user = record.user;
                      return (
                        <p key={`user.Identifer-${idx}`}>
                          <span>{getD2LDisplayName(user)}</span>
                          <span> chose {record.responseResult.choice.id}</span>
                        </p>
                      )
                    })}

                    <p>{recordsForQuestion[0].question.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

    )
  }


}

export default ResultsView
