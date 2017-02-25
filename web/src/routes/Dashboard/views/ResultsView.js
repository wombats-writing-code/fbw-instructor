import React, {Component} from 'react';
import _ from 'lodash'

import EmptyState from '../../../components/EmptyState'
import QuestionResult from '../components/QuestionResult'
import StudentStatusList from './StudentStatusList'

// import DirectiveCarousel from 'fbw-platform-common/components/mission/web/DirectiveCarousel'
// import TargetCarouselComponent from 'fbw-platform-common/components/mission/web/TargetCarousel'
// import TargetCarouselContainer from 'fbw-platform-common/components/mission/TargetCarouselContainer'
// const TargetCarousel = TargetCarouselContainer(TargetCarouselComponent)

// we make a local copy of TargetCarousel here and change it
// because our needs are slightly different from the one in common
// after Unit 1, we'll refactor
// import TargetCarousel from './TargetCarousel'


import './ResultsView.scss'

class ResultsView extends Component {

  constructor() {
    super();

    this.state = {
      isQuestionsExpanded: false,
    }
  }

  render() {
    let results = this.props.results;
    console.log('props of ResultsView', this.props)

    if (!results) {
      return null;
    }

    let resultsQuestions;
    if (this.state.isQuestionsExpanded) {
      resultsQuestions = (
        <ol className="results__questions-list">
          {_.map(results.incorrectQuestionsRanked, (recordsForQuestion) => {
            // console.log(recordsForQuestion[0].question.id)
            let outcome = _.find(this.props.outcomes, {id: recordsForQuestion[0].outcome});

            return (
              <li key={`incorrect-question-${recordsForQuestion[0].question.id}`}>
                <QuestionResult records={recordsForQuestion} outcome={outcome} />
              </li>
            )
          })}
        </ol>
      )
    }

    let resultsOutcomes;
    if (this.state.isOutcomesExpanded) {
      resultsOutcomes = (
        <ol className="">

        </ol>
      )
    }

    return (
      <div className="results-view">
        <StudentStatusList studentsOpened={results.studentsOpened} studentsNotOpened={results.studentsNotOpened}/>

        <div className="results__section">
          <div className="flex-container space-between align-center">
            <p className="results__subtitle">Questions most missed</p>
            <button className="expand-collapse-button"
                    onClick={(e) => this.setState({isQuestionsExpanded: !this.state.isQuestionsExpanded})}>
              {this.state.isQuestionsExpanded ? 'Hide' : 'Show'}
            </button>
          </div>

          {resultsQuestions}
        </div>

        <div className="results__section">
          <div className="flex-container space-between align-center">
            <p className="results__subtitle">Outcomes most missed</p>
            <button className="expand-collapse-button"
                    onClick={(e) => this.setState({isOutcomesExpanded: !this.state.isOutcomesExpanded})}>
              {this.state.isOutcomesExpanded ? 'Hide' : 'Show'}
            </button>
          </div>

          {resultsOutcomes}
        </div>
      </div>

    )
  }


}

export default ResultsView
