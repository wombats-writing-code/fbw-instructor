import _ from 'lodash'
import { connect } from 'react-redux'

import { filterItemsByTarget } from 'platform-common/selectors'
import { selectChoice } from 'platform-common/reducers/Mission/selectChoice'
import { submitResponse } from 'platform-common/reducers/Mission/submitResponse'
import { showAnswer } from 'platform-common/reducers/Mission/showAnswer'

const mapStateToProps = (state, ownProps) => {
  let currentQuestion
  if (typeof state.mission.currentTargetIndex !== 'undefined') {
    let directiveQuestions = state.mission.currentMissionSections[state.mission.currentDirectiveIndex].questions
    let routeQuestions = filterItemsByTarget(directiveQuestions)
    currentQuestion = _.last(routeQuestions[state.mission.currentTargetIndex])
  }
  return {
    mission: state.mission.currentMission ? state.mission.currentMission : null,
    selectedChoiceId: state.mission.selectedChoiceId ? state.mission.selectedChoiceId : null,
    question: currentQuestion,
    outcome: state.outcome.outcomes ? _.find(state.outcome.outcomes, {id: currentQuestion.learningObjectiveIds[0]}) : null,
    isInProgressSubmitChoice: state.mission.isInProgressSubmitChoice ? state.mission.isInProgressSubmitChoice : false,
    isInProgressShowAnswer: state.mission.isInProgressShowAnswer ? state.mission.isInProgressShowAnswer : false,
    section: typeof state.mission.currentDirectiveIndex !== 'undefined' ? state.mission.currentMissionSections[state.mission.currentDirectiveIndex] : null,
    username: state.login.username
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSelectChoice: data => dispatch(selectChoice(data)),
    onSubmitResponse: data => dispatch(submitResponse(data)),
    onShowAnswer: data => dispatch(showAnswer(data))
  }
}

const provider = (component) => {
  return connect(mapStateToProps, mapDispatchToProps)(component)
}

export default provider
